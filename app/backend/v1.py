import asyncio
from fastapi import APIRouter, Request, File, UploadFile
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer
import pymupdf


model_name = "paraphrase-MiniLM-L6-v2"
sentence_model = SentenceTransformer(model_name)
kw_model = KeyBERT(model_name)

router = APIRouter()


async def extract_keywords(text):
    return await asyncio.to_thread(
        kw_model.extract_keywords, text, keyphrase_ngram_range=(1, 2)
    )  # keyphrase_ngram_range sets the amount of words per phrase


@router.get("/keywords")
async def get_keywords(request: Request):
    body: dict = await request.json()
    raw_text = body.get("raw")

    if raw_text is None:
        return {"error": "Missing 'raw' field in request body."}

    keywords = await extract_keywords(raw_text)

    return {"result": keywords}


@router.post("/extract-pdf-content")
async def extract_pdf_content(file: UploadFile = File(...)):
    pdf_bytes = await file.read()

    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")

    parsed_text = ""
    for page_num in range(len(doc)):
        page = doc[page_num]
        parsed_text += page.get_text("text")  # type: ignore

    return {"payload": parsed_text, "filename": file.filename, "pages": len(doc)}


@router.post("/extract-pdf-keywords")
async def extract_pdf_keywords(file: UploadFile = File(...)):
    pdf_bytes = await file.read()

    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")

    parsed_text = ""
    for page_num in range(len(doc)):
        page = doc[page_num]
        parsed_text += page.get_text("text")  # type: ignore

    result = await extract_keywords(parsed_text)

    keywords = [(f"{k[0]} tutorial") for k in result]

    return {"payload": keywords, "filename": file.filename, "pages": len(doc)}
