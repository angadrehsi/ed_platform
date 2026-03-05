from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID, uuid4

from database.session import get_db
from models.models import Progress
from schemas.progress import ProgressCreate, ProgressOut, LessonComplete, LessonRead

router = APIRouter()


@router.post("/progress/read", response_model=ProgressOut)
def mark_as_read(payload: LessonRead, db: Session = Depends(get_db)):
    existing = (
        db.query(Progress)
        .filter(
            Progress.student_id == str(payload.student_id),
            Progress.lesson_id == str(payload.lesson_id),
            Progress.progress_type == "read",
        )
        .first()
    )
    if existing:
        return existing
    record = Progress(
        id=uuid4(),
        student_id=payload.student_id,
        lesson_id=payload.lesson_id,
        score=50,
        progress_type="read",
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.post("/progress/complete", response_model=ProgressOut)
def complete_lesson(payload: LessonComplete, db: Session = Depends(get_db)):
    existing = (
        db.query(Progress)
        .filter(
            Progress.student_id == str(payload.student_id),
            Progress.lesson_id == str(payload.lesson_id),
            Progress.progress_type == "quiz",
        )
        .first()
    )
    if existing:
        return existing
    record = Progress(
        id=uuid4(),
        student_id=payload.student_id,
        lesson_id=payload.lesson_id,
        score=payload.score,
        progress_type="quiz",
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/progress/total/{user_id}")
def get_total_score(user_id: UUID, db: Session = Depends(get_db)):
    records = db.query(Progress).filter(Progress.student_id == str(user_id)).all()
    total = sum(r.score for r in records)
    lessons_completed = len(
        set(r.lesson_id for r in records if r.progress_type == "quiz")
    )
    return {
        "student_id": user_id,
        "total_score": total,
        "lessons_completed": lessons_completed,
    }


@router.get("/progress/{user_id}", response_model=list[ProgressOut])
def get_user_progress(user_id: UUID, db: Session = Depends(get_db)):
    return db.query(Progress).filter(Progress.student_id == str(user_id)).all()
