from fastapi import FastAPI
import os
from dotenv import load_dotenv

load_dotenv()
print(os.getenv("TEST"))

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}
