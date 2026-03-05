const BASE_URL = import.meta.env.VITE_API_URL;

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: { label: string; text: string }[];
  correct_label: string;
  explanation: string;
}

export const streamChat = async (
  lesson_id: string,
  topic: string,
  content: string,
  history: ChatMessage[],
  message: string,
  onChunk: (chunk: string) => void,
  onDone: (reply: string) => void
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ lesson_id, topic, content, history, message }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const lines = decoder.decode(value).split("\n").filter(Boolean);
    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.chunk) onChunk(parsed.chunk);
        if (parsed.done) onDone(parsed.reply);
      } catch {
      }
    }
  }
};

export const generateQuiz = async (
  lesson_id: string,
  topic: string,
  content: string
): Promise<QuizQuestion[]> => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/ai/quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ lesson_id, topic, content }),
  });

  const data = await response.json();
  return data.questions;
};