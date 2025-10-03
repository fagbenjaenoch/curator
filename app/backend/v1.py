from fastapi import APIRouter, Request
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer
from transformers import pipeline


model_name = "paraphrase-MiniLM-L6-v2"
sentence_model = SentenceTransformer(model_name)
kw_model = KeyBERT(model_name)

paraphraser = pipeline("text2text-generation", model="t5-small")

router = APIRouter()


@router.get("/keywords")
async def get_keywords(request: Request):
    body: dict = await request.json()
    rawText = body.get("raw")

    if rawText is None:
        return {"error": "Missing 'raw' field in request body."}

    result = kw_model.extract_keywords(rawText, keyphrase_ngram_range=(1, 2))

    return {"result": result}


# @router.get("/extract-content")
