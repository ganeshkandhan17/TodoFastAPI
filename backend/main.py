from fastapi import FastAPI
import os
from dotenv import load_dotenv
from backend.model.db import connectDB
from pydantic import BaseModel
from backend.model.db import db
import uuid
from fastapi.middleware.cors import CORSMiddleware


class Task(BaseModel):
    taskName: str


load_dotenv()
connectDB()

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "https://app.example.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/")
async def createTask(taskName: Task):
    taskId = uuid.uuid4()
    db.execute(
        "insert into task (task_id,task_name) values(%s,%s)",
        (str(taskId), taskName.taskName),
    )
    db.connection.commit()
    return {"status": True, "taskId": taskId}
