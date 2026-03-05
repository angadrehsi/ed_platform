# CosmoAI

An AI-powered platform for learning about space. Read the created lesson plan, attempt quizzes, and earn points. Still Curious? Just ask **COSMO**
---

## Features

- **Reading Content** — 4 space lessons (Solar System, Mars, Black Holes, Stars) with progress tracking
- **Cosmo AI Tutor** — Streaming chat guided by lesson content
- **AI Quiz Generation** — 5 multiple-choice questions generated per lesson using RAG
- **Point System** — 50 points for reading, and 10 points for every right answer on the quiz!

---

## Tech Stack

**Backend built with**
- FastAPI + PostgreSQL + SQLAlchemy
- Google Gemini 2.0 Flash Lite

**Frontend built with**
- React + TypeScript + Vite
- React Router, Axios
---

## Implementation

| Requirement | Implementation |
|---|---|
| LLM Integration | Gemini 2.0 Flash Lite (`gemini-2.0-flash-lite`) |
| Structured Output | Quiz endpoint returns JSON |
| Context | Full conversation `history` array passed to Gemini |
| Grounding | Lesson `content` to guide Gemini |
| Latency Handling | Chunk-by-chunk Streaming|

---

##  Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL

### Backend

```
cd backend
python -m venv .venv
.venv\Scripts\activate
SET ENV VARIABLES
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```
cd frontend
npm install
SET ENV VARIABLES
npm run dev
```

---

## Sample Environment Variables

### Backend `.env`
```
DATABASE_URL=postgresql://user:password@localhost:5432/spacey
GEMINI_API_KEY=your_gemini_api_key
MODEL="gemini-1.5-flash"
fe=* or frontend url
```

### Frontend `.env`
```
VITE_API_URL=http://127.0.0.1:8000 (backend url)
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/register` | Create account |
| POST | `/users/login` | Get session token |
| GET | `/lessons/` | All lessons |
| GET | `/lessons/{id}` | Single lesson with content |
| POST | `/progress/read` | Mark lesson as read (+50 pts) |
| POST | `/progress/complete` | Submit quiz score |
| GET | `/progress/{user_id}` | User progress records |
| GET | `/progress/total/{user_id}` | Total score + completions |
| POST | `/ai/chat` | Streaming chat with Cosmo |
| POST | `/ai/quiz` | Generate quiz questions |

---
