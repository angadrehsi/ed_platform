from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from database.session import get_db
from models.models import Progress
from schemas.progress import ProgressCreate, ProgressOut

router = APIRouter()


@router.post("/progress/", response_model=ProgressOut)
def create_progress(progress: ProgressCreate, db: Session = Depends(get_db)):
    db_progress = Progress(
        id=uuid.uuid4(),
        student_id=progress.student_id,
        lesson_id=progress.lesson_id,
        score=progress.score,
    )
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return db_progress


@router.get("/progress/{user_id}", response_model=list[ProgressOut])
def get_user_progress(user_id: uuid.UUID, db: Session = Depends(get_db)):
    records = db.query(Progress).filter(Progress.student_id == user_id).all()
    return records
