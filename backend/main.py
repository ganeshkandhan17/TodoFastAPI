from fastapi import FastAPI
import os
from dotenv import load_dotenv
from backend.model.db import connectDB

load_dotenv()
connectDB()

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}
