import os
from pathlib import Path
from dotenv import load_dotenv
from psycopg2 import connect

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

DB_HOST = os.getenv("DB_HOST")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_USER = os.getenv("DB_USER")
DB_PORT = os.getenv("DB_PORT")

db = connect(
    dbname="todo", host=DB_HOST, user=DB_USER, port=DB_PORT, password=DB_PASSWORD
)


def connectDB():
    return db.cursor()
