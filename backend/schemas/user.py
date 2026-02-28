from pydantic import BaseModel, EmailStr, Field
from uuid import UUID


class UserCreate(BaseModel):
    name: str
    email: EmailStr


class UserOut(BaseModel):
    id: UUID
    name: str
    email: EmailStr

    class Config:
        orm_mode = True
