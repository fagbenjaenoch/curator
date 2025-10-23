import asyncio
import pymupdf
from ratelimiter import limiter
from fastapi import APIRouter, Request, File, UploadFile, HTTPException
from keybert import KeyBERT

router = APIRouter()

model_name = "paraphrase-MiniLM-L6-v2"
kw_model = KeyBERT(model_name)  # type: ignore


MAX_FILE_SIZE_MB = 5
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
