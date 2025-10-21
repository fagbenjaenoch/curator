import asyncio
import pymupdf
from fastapi import APIRouter, Request, File, UploadFile
from keybert import KeyBERT


model_name = "paraphrase-MiniLM-L6-v2"
kw_model = KeyBERT(model_name)  # type: ignore

router = APIRouter()


async def extract_keywords(doc):
    return await asyncio.to_thread(
        kw_model.extract_keywords,
        doc,
        keyphrase_ngram_range=(1, 2),
    )


@router.get("/keywords")
async def get_keywords(request: Request):
    body: dict = await request.json()
    raw_text = body.get("raw")

    if raw_text is None:
        return {"error": "Missing 'raw' field in request body."}

    keywords = await extract_keywords(raw_text)

    return {"result": keywords}


@router.post("/extract-pdf-keywords")
async def extract_pdf_keywords(file: UploadFile = File(...)):
    pdf_bytes = await file.read()

    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")

    parsed_text = ""
    for page in doc:
        parsed_text += page.get_text("text")  # type: ignore

    result = await extract_keywords(parsed_text)

    keywords = [(f"{k[0]}") for k in result]

    return {"payload": keywords, "filename": file.filename, "pages": len(doc)}
