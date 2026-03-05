from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.session import get_db
from models.models import Lesson
from schemas.lesson import LessonOut

router = APIRouter()


@router.get("/lessons/", response_model=list[LessonOut])
def get_all_lessons(db: Session = Depends(get_db)):
    return db.query(Lesson).order_by(Lesson.id).all()


@router.get("/lessons/{lesson_id}", response_model=LessonOut)
def get_lesson(lesson_id: str, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson
