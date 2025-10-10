from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import v1

app = FastAPI()


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def index():
    return {"message": "Hello from python backend"}


app.include_router(v1.router, prefix="/v1")
