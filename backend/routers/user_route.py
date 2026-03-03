from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from database.session import get_db
from models.models import User
from schemas.user import UserCreate, UserLogin, UserOut, logout

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if db.query(User).filter(User.name == user.name).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    db_user = User(
        id=uuid.uuid4(),
        name=user.name,
        email=user.email,
        password=user.password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/login", response_model=logout)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = (
        db.query(User)
        .filter(User.email == credentials.email, User.password == credentials.password)
        .first()
    )

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = str(uuid.uuid4())
    user.session_token = token
    db.commit()
    db.refresh(user)

    return {"token": token, "user": user.name}
