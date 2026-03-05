from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database.base import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    password = Column(String, nullable=False)
    session_token = Column(String, nullable=True)


class Progress(Base):
    __tablename__ = "progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(String, index=True)
    lesson_id = Column(String)
    progress = Column(Integer)
    progress_type = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    score = Column(Integer, default=0)


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
