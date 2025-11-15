import asyncio
import pymupdf
from typing import List
from ratelimiter import limiter
from fastapi import APIRouter, Request, File, UploadFile, HTTPException
from keybert import KeyBERT
from keybert.backend import BaseEmbedder
from langchain_huggingface import HuggingFaceEmbeddings

# from langchain_community.cache import RedisCache, InMemoryCache
from langchain_community.storage import RedisStore
from langchain_core.stores import InMemoryByteStore
from langchain_classic.embeddings.cache import CacheBackedEmbeddings
import numpy as np

router = APIRouter()


# redis_client = redis.Redis(host="localhost", port=6379, db=0)
redis_store = RedisStore(
    redis_url="redis://localhost:6379", namespace="keybert-cache")

in_memory_store = InMemoryByteStore()

model_name = "paraphrase-MiniLM-L6-v2"
underlying_embeddings = HuggingFaceEmbeddings(model_name=model_name)
cached_embedder = CacheBackedEmbeddings.from_bytes_store(
    underlying_embeddings,
    document_embedding_cache=in_memory_store,
    namespace=underlying_embeddings.model_name,
    key_encoder="sha256",
)


class LangChainEmbedder(BaseEmbedder):

    def __init__(
        self,
        embedding_model,
    ):
        super().__init__()
        self.embedding_model = embedding_model

    def embed(self, documents: List[str], verbose: bool = False) -> np.ndarray:
        # TODO: add a check below if documents is not a type of List[str]
        embeddings = self.embedding_model.embed_documents(documents)
        return np.array(embeddings)


kw_model = KeyBERT(model=LangChainEmbedder(cached_embedder))  # type: ignore


MAX_FILE_SIZE_MB = 1
MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024


async def extract_keywords(doc):
    return await asyncio.to_thread(
        kw_model.extract_keywords,
        doc,
        keyphrase_ngram_range=(1, 2),
    )


@router.get("/keywords")
@limiter.limit("5/minute")
async def get_keywords(request: Request):
    body: dict = await request.json()
    raw_text = body.get("raw")

    if raw_text is None:
        return {"error": "Missing 'raw' field in request body."}

    keywords = await extract_keywords(raw_text)

    return {"result": keywords}


@router.post("/extract-pdf-keywords")
@limiter.limit("5/minute")
async def extract_pdf_keywords(request: Request, file: UploadFile = File(...)):
    if file.content_type not in [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only pdf and docx files are allowed",
        )

    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400, detail=f"File is larger than {MAX_FILE_SIZE_MB}MB"
        )
    pdf_bytes = await file.read()

    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")

    parsed_text = ""
    for page in doc:
        parsed_text += page.get_text("text")  # type: ignore

    result = await extract_keywords(parsed_text)

    keywords = [(f"{k[0]}") for k in result]

    return {"payload": keywords, "filename": file.filename, "pages": len(doc)}
