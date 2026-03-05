from pydantic import BaseModel
from typing import Literal
from uuid import UUID


class ChatMessage(BaseModel):
    role: Literal["user", "model"]
    text: str


class ChatRequest(BaseModel):
    lesson_id: str
    topic: str
    content: str
    history: list[ChatMessage]
    message: str


class QuizRequest(BaseModel):
    lesson_id: str
    topic: str
    content: str


class QuizOption(BaseModel):
    label: str
    text: str


class QuizQuestion(BaseModel):
    question: str
    options: list[QuizOption]
    correct_label: str
    explanation: str
