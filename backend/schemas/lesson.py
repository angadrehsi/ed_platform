from pydantic import BaseModel


class LessonOut(BaseModel):
    id: str
    title: str
    topic: str
    content: str

    class Config:
        orm_mode = True
