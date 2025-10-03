from fastapi import APIRouter, Request, File, UploadFile
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer
import pymupdf


model_name = "paraphrase-MiniLM-L6-v2"
sentence_model = SentenceTransformer(model_name)
kw_model = KeyBERT(model_name)

router = APIRouter()


@router.get("/keywords")
async def get_keywords(request: Request):
    body: dict = await request.json()
    rawText = body.get("raw")

    if rawText is None:
        return {"error": "Missing 'raw' field in request body."}

    result = kw_model.extract_keywords(
        rawText, keyphrase_ngram_range=(1, 2)
    )  # keyphrase_ngram_range sets the amount of words per phrase

    return {"result": result}


@router.get("/extract-pdf-content")
async def extract_pdf_content(file: UploadFile = File(...)):
    pdf_bytes = await file.read()

    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")

    parsed_text = ""
    for page_num in range(len(doc)):
        page = doc[page_num]
        parsed_text += page.get_text("text")  # type: ignore

    return {"content": parsed_text, "filename": file.filename, "pages": len(doc)}
