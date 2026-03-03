import os
import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from google import genai
from google.genai import types
from dotenv import load_dotenv

from schemas.response import ChatRequest, QuizRequest
from utils.prompts import build_system_prompt, build_quiz_prompt

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = os.getenv("MODEL", "gemini-2.0-flash-lite")
router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/chat")
async def chat(request: ChatRequest):
    history = [
        types.Content(role=msg.role, parts=[types.Part(text=msg.text)])
        for msg in request.history
    ]

    user_message = request.message
    if not request.history:
        user_message = (
            f"{build_system_prompt(request.topic)}\n\nStudent: {request.message}"
        )

    async def stream_response():
        try:
            full_reply = ""
            stream = client.models.generate_content_stream(
                model=MODEL,
                contents=history
                + [types.Content(role="user", parts=[types.Part(text=user_message)])],
            )
            for chunk in stream:
                text = chunk.text or ""
                full_reply += text
                yield json.dumps({"chunk": text}) + "\n"

            yield json.dumps(
                {"done": True, "reply": full_reply, "lesson_id": request.lesson_id}
            ) + "\n"

        except Exception as e:
            yield json.dumps({"error": str(e)}) + "\n"

    return StreamingResponse(stream_response(), media_type="application/x-ndjson")


@router.post("/quiz")
async def generate_quiz(request: QuizRequest):
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=build_quiz_prompt(request.topic),
        )
        raw = response.text.strip()

        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        parsed = json.loads(raw)
        return {"lesson_id": request.lesson_id, "questions": parsed["questions"]}

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500, detail="AI returned malformed JSON. Try again."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
