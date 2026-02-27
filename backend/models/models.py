from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Progess(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, index=True)
    lesson_id = Column(String)
    progress = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    score = Column(Integer, default=0)
