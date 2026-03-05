from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models
from database.session import engine
from database.base import Base
from routers.user_route import router as users_router
from routers.progress_route import router as progress_router
from routers.lesson_route import router as lessons_router
from routers.llm_route import router as llm_router
import models.models
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("fe")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(progress_router)
app.include_router(lessons_router)
app.include_router(llm_router)


@app.get("/")
def root():
    return {"message": "Backend Running"}
