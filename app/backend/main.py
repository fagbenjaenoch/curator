from fastapi import FastAPI, Request
import v1

app = FastAPI()


@app.get("/")
def index():
    return {"message": "Hello from python"}


app.include_router(v1.router, prefix="/v1")
