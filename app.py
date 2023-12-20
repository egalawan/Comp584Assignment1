from http.client import HTTPResponse
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List

app = FastAPI()

class Task(BaseModel):
    title: str

class Comment(BaseModel):
    text: str

tasks_db = []
comments_db = []

@app.get("/", response_class=HTTPResponse)
def read_root():
    return FileResponse("index.html")