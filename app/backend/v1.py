import asyncio
from typing import List

# import redis
import pymupdf
from fastapi import APIRouter, Request, File, UploadFile
from keybert import KeyBERT
from keybert.backend import BaseEmbedder
from langchain_huggingface import HuggingFaceEmbeddings

# from langchain_community.cache import RedisCache, InMemoryCache
from langchain_community.storage import RedisStore
from langchain_core.stores import InMemoryByteStore
from langchain_classic.embeddings.cache import CacheBackedEmbeddings
import numpy as np


# redis_client = redis.Redis(host="localhost", port=6379, db=0)

redis_store = RedisStore(redis_url="redis://localhost:6379", namespace="keybert-cache")

in_memory_store = InMemoryByteStore()

model_name = "paraphrase-MiniLM-L6-v2"
underlying_embeddings = HuggingFaceEmbeddings(model_name=model_name)
cached_embedder = CacheBackedEmbeddings.from_bytes_store(
    underlying_embeddings,
    document_embedding_cache=in_memory_store,
    namespace=underlying_embeddings.model_name,
    key_encoder="sha256",
)

kw_model = KeyBERT(model_name)

router = APIRouter()


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


async def extract_keywords(doc, doc_embeddings):
    return await asyncio.to_thread(
        kw_model.extract_keywords,
        doc,
        doc_embeddings=doc_embeddings,
        keyphrase_ngram_range=(1, 2),
    )


@router.get("/keywords")
async def get_keywords(request: Request):
    body: dict = await request.json()
    raw_text = body.get("raw")

    if raw_text is None:
        return {"error": "Missing 'raw' field in request body."}

    keywords = await extract_keywords(raw_text, doc_embeddings=None)

    return {"result": keywords}


@router.post("/extract-pdf-keywords")
async def extract_pdf_keywords(file: UploadFile = File(...)):
    pdf_bytes = await file.read()

    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")

    parsed_text = ""
    for page in doc:
        parsed_text += page.get_text("text")  # type: ignore

    doc_embedding = await cached_embedder.aembed_documents([parsed_text])

    result = await extract_keywords(
        doc=parsed_text, doc_embeddings=np.array(doc_embedding)
    )

    keywords = [(f"{k[0]}") for k in result]

    return {"payload": keywords, "filename": file.filename, "pages": len(doc)}
