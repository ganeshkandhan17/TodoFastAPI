from fastapi import FastAPI, HTTPException
import os
from dotenv import load_dotenv
from backend.model.db import connectDB
from pydantic import BaseModel
from backend.model.db import connectDB
import uuid
from fastapi.middleware.cors import CORSMiddleware


class Task(BaseModel):
    taskName: str | None = None
    taskId: str | None = None
    isCompleted: bool | None = None


load_dotenv()


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "https://app.example.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/")
async def createTask(taskName: Task):
    taskId = uuid.uuid4()
    try:
        with connectDB() as db:
            db.execute(
                "insert into task (task_id,task_name) values(%s,%s)",
                (str(taskId), taskName.taskName),
            )
            db.connection.commit()
            return {"status": True, "taskId": taskId}
    except Exception as e:
        raise HTTPException(status="400")


@app.get("/")
async def getTask():
    try:
        with connectDB() as db:
            query = """
                SELECT
                    task_id,
                    task_name,
                    is_complete
                FROM
                    task
                WHERE
                    is_active = 'active'
                """
            db.execute(query)
            response = db.fetchall()
            response = [
                {"taskId": row[0], "taskName": row[1], "isComplete": row[2]}
                for row in response
            ]
            return {"status": True, "tasks": response}
    except Exception as e:
        raise HTTPException(status="400")


@app.delete("/")
async def deleteTask(taskId: str):
    taskId = str(taskId)
    try:
        with connectDB() as db:
            query = """
                UPDATE 
                    task
                SET
                    is_active = 'inactive'
                WHERE
                    task_id = %s                  
            """
            db.execute(query, (taskId,))
            db.connection.commit()
            return {"status": True}
    except Exception as e:
        print("Error occurs in delete")
        print(e)
        return {}


@app.put("/")
async def editTask(Task: Task):
    try:
        with connectDB() as db:
            query = """
            UPDATE
                task
            SET
                task_name  = %s               
            WHERE
                task_id = %s
            """
            db.execute(query, (Task.taskName, Task.taskId))
            db.connection.commit()
    except Exception as e:
        print("Error in the")
        return {"status": False}
    return {}


@app.put("/change-status")
async def changeStatus(Task: Task):
    print("entered")
    taskStatus = Task.isCompleted
    taskId = Task.taskId
    taskStatus = "completed" if bool(taskStatus) else "incomplete"
    try:
        with connectDB() as db:
            query = """
            UPDATE
                task
            SET
                is_complete = %s
            WHERE
                task_id = %s
            """
            db.execute(query, (taskStatus, taskId))
            db.connection.commit()
            return {"status": True}
    except Exception as e:
        return {"status": False}
