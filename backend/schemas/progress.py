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
    progress_type: str

    class Config:
        orm_mode = True


class LessonComplete(BaseModel):
    student_id: UUID
    lesson_id: str
    score: int


class LessonRead(BaseModel):
    student_id: UUID
    lesson_id: str
