import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcon";
import { getLesson } from "../api/lessons";
import type { Lesson } from "../api/lessons";
import { markAsRead, completeLesson, getUserProgress } from "../api/progress_end";
import type { ProgressRecord } from "../api/progress_end";
import { streamChat, generateQuiz } from "../api/ai";
import type { ChatMessage, QuizQuestion } from "../api/ai";
import StarsBg from "../components/bg";

const TOPIC_COLOR: Record<string, string> = {
  "Solar System": "#f59e0b",
  "Mars": "#ef4444",
  "Black Holes": "#8b5cf6",
  "Stars": "#eab308",
};

export default function Lesson() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [tab, setTab] = useState<"read" | "chat" | "quiz">("read");
  const [existingProgress, setExistingProgress] = useState<ProgressRecord[]>([]);
  const [hasRead, setHasRead] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAlreadyDone, setQuizAlreadyDone] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    getLesson(id).then((l) => {
      setLesson(l);
      const saved = sessionStorage.getItem(`chat_${id}`);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages([{ role: "model", text: `Hi, I'm the Cosmo AI tutor. I'm here to help you with ${l.topic}. Ask me anything about what you've just read.` }]);
      }
    });
    getUserProgress(user.id).then((records) => {
      setExistingProgress(records);
      setHasRead(records.some(r => r.lesson_id === id && r.progress_type === "read"));
      const alreadyQuiz = records.some(r => r.lesson_id === id && r.progress_type === "quiz");
      setQuizAlreadyDone(alreadyQuiz);
      if (alreadyQuiz) setSubmitted(true);
    });
  }, [id, user]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamingText]);
  useEffect(() => { if (!id || messages.length === 0) return; sessionStorage.setItem(`chat_${id}`, JSON.stringify(messages)); }, [messages, id]);

  const handleMarkAsRead = async () => {
    if (!user || !lesson || hasRead) return;
    setMarkingRead(true);
    try { await markAsRead(user.id, lesson.id); setHasRead(true); } finally { setMarkingRead(false); }
  };

  const sendMessage = async () => {
    if (!input.trim() || streaming || !lesson) return;
    const userMsg: ChatMessage = { role: "user", text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput(""); setStreaming(true); setStreamingText("");
    await streamChat(lesson.id, lesson.topic, lesson.content, messages, userMsg.text,
      (chunk) => setStreamingText(p => p + chunk),
      (reply) => { setMessages(prev => [...prev, { role: "model", text: reply }]); setStreamingText(""); setStreaming(false); }
    );
  };

  const loadQuiz = async () => {
    if (!hasRead) { setTab("read"); return; }
    setTab("quiz");
    if (!lesson || quizAlreadyDone || questions.length > 0) return;
    setQuizLoading(true);
    const q = await generateQuiz(lesson.id, lesson.topic, lesson.content);
    setQuestions(q); setQuizLoading(false);
  };

  const submitQuiz = async () => {
    if (!user || !lesson) return;
    const correct = questions.filter((q, i) => answers[i] === q.correct_label).length;
    const score = correct * 10;
    setQuizScore(score); setSubmitted(true);
    try { await completeLesson(user.id, lesson.id, score); } catch {}
  };

  const correctCount = questions.filter((q, i) => answers[i] === q.correct_label).length;
  const color = lesson ? (TOPIC_COLOR[lesson.topic] ?? "#6366f1") : "#6366f1";
  const existingQuizScore = existingProgress.find(p => p.lesson_id === id && p.progress_type === "quiz")?.score ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "system-ui, sans-serif", color: "white", display: "flex", flexDirection: "column", position: "relative" }}>
      <style>{`
        * { box-sizing: border-box; }
        .chat-input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 0.65rem 0.9rem; color: white; font-family: inherit; font-size: 0.88rem; outline: none; transition: border-color 0.15s; }
        .chat-input:focus { border-color: #6366f1; }
        .chat-input::placeholder { color: rgba(255,255,255,0.2); }
        .option-btn:hover:not(:disabled) { background: rgba(255,255,255,0.08) !important; }
        .read-content p { color: rgba(255,255,255,0.65); font-size: 0.92rem; line-height: 1.8; margin-bottom: 1.1rem; }
      `}</style>

      <StarsBg />

      <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => navigate("/dashboard")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "0.3rem 0.85rem", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.8rem" }}>Dashboard</button>
          {lesson && <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>{lesson.title}</span>}
        </div>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {[
            { label: hasRead ? "Read +50" : "Read", done: hasRead },
            { label: submitted ? `Quiz +${quizAlreadyDone ? existingQuizScore : quizScore}` : "Quiz", done: submitted },
          ].map((pill, i) => (
            <span key={i} style={{ padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.72rem", background: pill.done ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${pill.done ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.08)"}`, color: pill.done ? "#4ade80" : "rgba(255,255,255,0.25)" }}>{pill.label}</span>
          ))}
        </div>
      </nav>

      {lesson && (
        <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", maxWidth: 800, width: "100%", margin: "0 auto", padding: "1.75rem 2rem" }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "0.2rem", marginBottom: "1.4rem", backdropFilter: "blur(8px)" }}>
            {([["read", "Read"], ["chat", "Ask Cosmo"], ["quiz", hasRead ? "Quiz" : "Quiz (read first)"]] as const).map(([t, label]) => (
              <button key={t} onClick={() => t === "quiz" ? loadQuiz() : setTab(t)} style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 500, fontSize: "0.82rem", background: tab === t ? "#4f46e5" : "transparent", color: tab === t ? "white" : "rgba(255,255,255,0.35)" }}>{label}</button>
            ))}
          </div>

          {tab === "read" && (
            <div>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "1.75rem", marginBottom: "1rem", backdropFilter: "blur(8px)" }}>
                <div style={{ marginBottom: "1.4rem" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, marginBottom: "0.65rem" }} />
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.2rem", letterSpacing: "-0.015em" }}>{lesson.title}</h2>
                  <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)" }}>{lesson.topic}</p>
                </div>
                <div className="read-content">{lesson.content.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}</div>
              </div>
              {!hasRead ? (
                <button onClick={handleMarkAsRead} disabled={markingRead} style={{ width: "100%", background: "#4f46e5", border: "none", color: "white", padding: "0.8rem", borderRadius: "6px", cursor: markingRead ? "not-allowed" : "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: "0.9rem", opacity: markingRead ? 0.6 : 1 }}>
                  {markingRead ? "Saving..." : "Mark as read — earn 50 points"}
                </button>
              ) : (
                <div style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "6px", padding: "0.8rem", textAlign: "center", color: "#4ade80", fontSize: "0.88rem" }}>
                  Lesson read — 50 points earned. Try the quiz next.
                </div>
              )}
            </div>
          )}

          {tab === "chat" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", overflow: "hidden", minHeight: 400, backdropFilter: "blur(8px)" }}>
              <div style={{ flex: 1, overflowY: "auto", padding: "1.1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    {msg.role === "model" && (
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: "#a5b4fc", marginRight: "0.45rem", flexShrink: 0, alignSelf: "flex-end" }}>AI</div>
                    )}
                    <div style={{ maxWidth: "75%", background: msg.role === "user" ? "rgba(79,70,229,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${msg.role === "user" ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: msg.role === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px", padding: "0.65rem 0.85rem", fontSize: "0.88rem", lineHeight: 1.6, color: "rgba(255,255,255,0.8)", whiteSpace: "pre-wrap" }}>{msg.text}</div>
                  </div>
                ))}
                {streaming && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: "#a5b4fc", marginRight: "0.45rem", flexShrink: 0, alignSelf: "flex-end" }}>AI</div>
                    <div style={{ maxWidth: "75%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px 10px 10px 2px", padding: "0.65rem 0.85rem", fontSize: "0.88rem", lineHeight: 1.6, color: "rgba(255,255,255,0.8)", whiteSpace: "pre-wrap" }}>{streamingText || "..."}</div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {messages.length === 1 && !streaming && (
                <div style={{ padding: "0 1.1rem 0.75rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {[`What is the most surprising fact about ${lesson.topic}?`, "Explain the key concepts simply.", "What should I focus on for the quiz?"].map((q) => (
                    <button key={q} onClick={() => setInput(q)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "999px", padding: "0.3rem 0.75rem", color: "rgba(255,255,255,0.4)", fontFamily: "inherit", fontSize: "0.76rem", cursor: "pointer", transition: "border-color 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "#6366f1")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                    >{q}</button>
                  ))}
                </div>
              )}

              <div style={{ padding: "0.8rem 1.1rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input className="chat-input" placeholder={`Ask about ${lesson.topic}...`} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} disabled={streaming} />
                <button onClick={sendMessage} disabled={streaming || !input.trim()} style={{ width: 34, height: 34, borderRadius: "6px", background: input.trim() && !streaming ? "#4f46e5" : "rgba(255,255,255,0.05)", border: "none", cursor: "pointer", color: "white", fontFamily: "inherit", fontSize: "0.78rem", flexShrink: 0 }}>Send</button>
              </div>
            </div>
          )}

          {tab === "quiz" && (
            <div>
              {quizLoading && <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.25)", fontSize: "0.88rem" }}>Generating quiz...</div>}

              {!quizLoading && questions.length > 0 && !submitted && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "0.75rem 1rem", fontSize: "0.82rem", color: "rgba(255,255,255,0.35)" }}>
                    10 points per correct answer. Maximum {questions.length * 10} points.
                  </div>
                  {questions.map((q, qi) => (
                    <div key={qi} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "1.1rem", backdropFilter: "blur(8px)" }}>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.9rem", display: "flex", gap: "0.5rem" }}>
                        <span style={{ background: "rgba(255,255,255,0.06)", borderRadius: "4px", padding: "0.1rem 0.4rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>Q{qi + 1}</span>
                        {q.question}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                        {q.options.map((opt) => (
                          <button key={opt.label} className="option-btn" onClick={() => setAnswers({ ...answers, [qi]: opt.label })} style={{ background: answers[qi] === opt.label ? "rgba(79,70,229,0.2)" : "rgba(255,255,255,0.03)", border: `1px solid ${answers[qi] === opt.label ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)"}`, borderRadius: "6px", padding: "0.65rem 0.85rem", color: "white", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem", textAlign: "left", display: "flex", alignItems: "center", gap: "0.55rem", transition: "background 0.1s" }}>
                            <span style={{ width: 20, height: 20, borderRadius: "50%", background: answers[qi] === opt.label ? "#4f46e5" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, flexShrink: 0, color: "rgba(255,255,255,0.5)" }}>{opt.label}</span>
                            {opt.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={submitQuiz} disabled={Object.keys(answers).length < questions.length} style={{ background: "#4f46e5", border: "none", color: "white", padding: "0.8rem", borderRadius: "6px", cursor: Object.keys(answers).length < questions.length ? "not-allowed" : "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: "0.9rem", opacity: Object.keys(answers).length < questions.length ? 0.4 : 1 }}>
                    Submit ({Object.keys(answers).length}/{questions.length} answered)
                  </button>
                </div>
              )}

              {submitted && !quizLoading && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                  <div style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "10px", padding: "1.4rem", textAlign: "center" }}>
                    <div style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.2rem" }}>{quizAlreadyDone ? "Already completed" : `${correctCount} / ${questions.length} correct`}</div>
                    <div style={{ color: "#4ade80", fontSize: "0.88rem" }}>+{quizAlreadyDone ? existingQuizScore : quizScore} points</div>
                  </div>

                  {!quizAlreadyDone && questions.map((q, qi) => {
                    const correct = answers[qi] === q.correct_label;
                    return (
                      <div key={qi} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${correct ? "rgba(74,222,128,0.2)" : "rgba(239,68,68,0.2)"}`, borderRadius: "8px", padding: "1rem" }}>
                        <div style={{ display: "flex", gap: "0.45rem", marginBottom: "0.4rem", alignItems: "flex-start" }}>
                          <span style={{ color: correct ? "#4ade80" : "#f87171", flexShrink: 0, fontSize: "0.82rem" }}>{correct ? "Correct" : "Wrong"}</span>
                          <span style={{ fontWeight: 500, fontSize: "0.88rem" }}>{q.question}</span>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>
                          {!correct && <div style={{ color: "#fca5a5", marginBottom: "0.2rem" }}>Your answer: {answers[qi]} — Correct: {q.correct_label}</div>}
                          {q.explanation}
                        </div>
                      </div>
                    );
                  })}

                  <button onClick={() => navigate("/dashboard")} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", padding: "0.75rem", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.88rem" }}>Back to dashboard</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}