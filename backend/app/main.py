from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models
from database.session import engine
from database.base import Base
from routers.user_route import router as users_router
from routers.progress_route import router as progress_router
from routers.lesson_route import router as lessons_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(progress_router)
app.include_router(lessons_router)

@app.get("/")
def root():
    return {"message": "Backend Running"}