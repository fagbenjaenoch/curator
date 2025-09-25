from fastapi import FastAPI, Request
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer
from transformers import pipeline

app = FastAPI()

model_name = "paraphrase-MiniLM-L6-v2"
model = SentenceTransformer(model_name)
kw_model = KeyBERT(model)

paraphraser = pipeline("text2text-generation", model="t5-small")


@app.get("/")
def index():
    return {"message": "Hello from python"}


@app.get("/get-keywords")
async def get_keywords(request: Request):
    body: dict = await request.json()
    rawText = body.get("raw")

    result = kw_model.extract_keywords(rawText)

    return {"result": result}


@app.get("/paraphrase")
async def paraphrase(request: Request):
    body: dict = await request.json()
    rawText = body.get("raw")

    result = ""
    index = 1
    paraphrases = paraphraser(rawText, num_return_sequences=1, num_beams=5)
    for phrase in paraphrases:
        result += str(index) + " " + phrase.get("generated_text")
        index += 1

    return {"result": result}
