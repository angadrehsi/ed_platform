# app/schemas/progress.py
from pydantic import BaseModel
from uuid import UUID


class ProgressCreate(BaseModel):
    student_id: UUID
    lesson_id: str
    score: int


class ProgressOut(BaseModel):
    id: UUID
    student_id: UUID
    lesson_id: str
    score: int

    class Config:
        orm_mode = True
