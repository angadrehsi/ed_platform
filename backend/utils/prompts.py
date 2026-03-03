SYSTEM_PROMPT = """You are Cosmo, a friendly space science tutor for children aged 8-14.
You are currently teaching about: {topic}.
Only answer questions related to space and the current topic.
Keep answers to 3-4 sentences maximum. Short, fun, easy to understand for a young audience.
Use simple language.
Never make up facts.
"""


def build_system_prompt(topic: str) -> str:
    return SYSTEM_PROMPT.format(topic=topic)


QUIZ_PROMPT = """Generate exactly 3 multiple choice questions for children about: {topic}.

Respond ONLY with valid JSON, no markdown:
{{
  "questions": [
    {{
      "question": "...",
      "options": [
        {{"label": "A", "text": "..."}},
        {{"label": "B", "text": "..."}},
        {{"label": "C", "text": "..."}},
        {{"label": "D", "text": "..."}}
      ],
      "correct_label": "A",
      "explanation": "..."
    }}
  ]
}}

Facts only. Simple language for ages 8-14. Return JSON only.
"""


def build_quiz_prompt(topic: str) -> str:
    return QUIZ_PROMPT.format(topic=topic)
