from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID, uuid4
from sqlalchemy import cast
from database.session import get_db
from models.models import Progress
from schemas.progress import ProgressCreate, ProgressOut, LessonComplete
from utils.constants import LESSON_COMPLETION_SCORE

router = APIRouter()


@router.post("/progress/", response_model=ProgressOut)
def create_progress(progress: ProgressCreate, db: Session = Depends(get_db)):
    db_progress = Progress(
        id=uuid4(),
        student_id=progress.student_id,
        lesson_id=progress.lesson_id,
        score=progress.score,
    )
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return db_progress


@router.get("/progress/{user_id}", response_model=list[ProgressOut])
def get_user_progress(user_id: UUID, db: Session = Depends(get_db)):
    records = db.query(Progress).filter(Progress.student_id == str(user_id)).all()
    return records


@router.post("/progress/complete", response_model=ProgressOut)
def complete_lesson(payload: LessonComplete, db: Session = Depends(get_db)):
    existing = (
        db.query(Progress)
        .filter(
            Progress.student_id == str(payload.student_id),
            Progress.lesson_id == str(payload.lesson_id),
        )
        .first()
    )

    if existing:
        return existing

    record = Progress(
        id=uuid4(),
        student_id=payload.student_id,
        lesson_id=payload.lesson_id,
        score=LESSON_COMPLETION_SCORE,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/progress/total/{user_id}")
def get_total_score(user_id: UUID, db: Session = Depends(get_db)):
    records = db.query(Progress).filter(Progress.student_id == str(user_id)).all()
    total = sum(r.score for r in records)
    return {
        "student_id": user_id,
        "total_score": total,
        "lessons_completed": len(records),
    }
