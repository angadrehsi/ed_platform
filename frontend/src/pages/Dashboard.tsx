import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Authcon";
import { getLessons } from "../api/lessons";
import type { Lesson } from "../api/lessons";
import { getUserProgress, getTotalScore } from "../api/progress_end";
import type { ProgressRecord, TotalScore } from "../api/progress_end";
import WelcomeModal from "../components/welcome";
import StarsBg from "../components/bg";
import Navbar from "../components/NavBar";

const TOPIC_COLOR: Record<string, string> = {
  "Solar System": "#f59e0b",
  "Mars":         "#ef4444",
  "Black Holes":  "#8b5cf6",
  "Stars":        "#eab308",
};

const TOPIC_IMAGE: Record<string, string> = {
  "Solar System": "/solar_logo.svg",
  "Mars":         "/mars_logo.svg",
  "Black Holes":  "/bh_logo.svg",
  "Stars":        "/star_logo.svg",
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [lessons,    setLessons]    = useState<Lesson[]>([]);
  const [progress,   setProgress]   = useState<ProgressRecord[]>([]);
  const [totalScore, setTotalScore] = useState<TotalScore | null>(null);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      getLessons(),
      getUserProgress(user.id).catch(() => []),
      getTotalScore(user.id).catch(() => null),
    ]).then(([l, p, t]) => {
      setLessons(l); setProgress(p); setTotalScore(t); setLoading(false);
    });
  }, [user, location.key]);

  const readIds  = new Set(progress.filter(p => p.progress_type === "read").map(p => p.lesson_id));
  const quizIds  = new Set(progress.filter(p => p.progress_type === "quiz").map(p => p.lesson_id));
  const fullyCompleted  = lessons.filter(l => readIds.has(l.id) && quizIds.has(l.id)).length;
  const progressPercent = lessons.length > 0 ? Math.round((fullyCompleted / lessons.length) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "system-ui, sans-serif", color: "white", position: "relative" }}>
      <style>{`
        * { box-sizing: border-box; }

        .lesson-card {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
        }
        .lesson-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.4);
        }
        .footer-link { background: none; border: none; color: rgba(255,255,255,0.25); cursor: pointer; font-family: inherit; font-size: 0.8rem; padding: 0; transition: color 0.15s; }
        .footer-link:hover { color: rgba(255,255,255,0.55); }
      `}</style>

      <StarsBg />
      <WelcomeModal />
      <Navbar links={[]} />

      <main style={{
        position: "relative", zIndex: 10,
        maxWidth: 1280, margin: "0 auto",
        padding: "2.5rem 4rem 4rem",
      }}>

        {/* Header row */}
        <div style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: "1.5rem",
          marginBottom: "2.5rem",
        }}>
          <div>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.4rem" }}>
              Mission Control
            </p>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1 }}>
              Your Lessons
            </h1>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: "0",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            overflow: "hidden",
            backdropFilter: "blur(10px)",
          }}>
            {[
              { value: totalScore?.total_score ?? 0, label: "Total score" },
              { value: fullyCompleted,                label: "Completed" },
              { value: lessons.length - fullyCompleted, label: "Remaining" },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "1rem 1.75rem",
                textAlign: "center",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}>
                <div style={{ fontSize: "1.6rem", fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginTop: "0.3rem", letterSpacing: "0.03em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: "2.75rem" }}>
          <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: "999px", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${progressPercent}%`,
              background: "linear-gradient(90deg, #6366f1, #a78bfa)",
              borderRadius: "999px", transition: "width 0.6s ease",
            }} />
          </div>
          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", marginTop: "0.5rem" }}>
            {fullyCompleted} of {lessons.length} lessons fully completed
          </div>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div style={{ textAlign: "center", paddingTop: "4rem", color: "rgba(255,255,255,0.2)", fontSize: "0.88rem" }}>Loading...</div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
          }}>
            {lessons.map((lesson) => {
              const isRead     = readIds.has(lesson.id);
              const isQuizDone = quizIds.has(lesson.id);
              const color      = TOPIC_COLOR[lesson.topic]  ?? "#6366f1";
              const img        = TOPIC_IMAGE[lesson.topic];
              const readScore  = isRead ? 50 : 0;
              const quizScore  = progress.find(p => p.lesson_id === lesson.id && p.progress_type === "quiz")?.score ?? 0;
              const lessonTotal = readScore + quizScore;

              return (
                <div
                  key={lesson.id}
                  className="lesson-card"
                  onClick={() => navigate(`/lessons/${lesson.id}`)}
                  style={{ borderColor: isQuizDone ? color + "55" : "rgba(255,255,255,0.08)" }}
                >
                  {/* Colour glow top-right */}
                  <div style={{
                    position: "absolute", top: -60, right: -60,
                    width: 200, height: 200, borderRadius: "50%",
                    background: color + "18",
                    filter: "blur(40px)",
                    pointerEvents: "none",
                  }} />

                  {/* Image banner */}
                  {img && (
                    <div style={{
                      width: "100%", height: 160,
                      overflow: "hidden",
                      background: "rgba(0,0,0,0.3)",
                      borderBottom: `1px solid ${color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <img
                        src={img}
                        alt={lesson.topic}
                        style={{
                          width: "30%", height: "100%",
                          objectFit: "cover",
                          opacity: 0.85,
                          mixBlendMode: "lighten",
                        }}
                      />
                    </div>
                  )}

                  {/* Card body */}
                  <div style={{ padding: "1.5rem 1.75rem 1.75rem" }}>
                    {/* Status + topic row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                        <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.03em" }}>{lesson.topic}</span>
                      </div>
                      {isRead && isQuizDone ? (
                        <span style={{ fontSize: "0.68rem", color: "#4ade80", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "999px", padding: "0.2rem 0.65rem", letterSpacing: "0.04em" }}>COMPLETE</span>
                      ) : isRead ? (
                        <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "999px", padding: "0.2rem 0.65rem", letterSpacing: "0.04em" }}>READ</span>
                      ) : null}
                    </div>

                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-0.015em", marginBottom: "1.1rem", lineHeight: 1.25 }}>
                      {lesson.title}
                    </h3>

                    {/* Progress pills */}
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
                      {[
                        { done: isRead,     label: "Read  +50" },
                        { done: isQuizDone, label: isQuizDone ? `Quiz  +${quizScore}` : "Quiz  +50" },
                      ].map((pill, i) => (
                        <div key={i} style={{
                          flex: 1, padding: "0.45rem 0.6rem",
                          borderRadius: "6px", textAlign: "center",
                          background: pill.done ? "rgba(74,222,128,0.07)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${pill.done ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.07)"}`,
                          fontSize: "0.72rem",
                          color: pill.done ? "#4ade80" : "rgba(255,255,255,0.25)",
                          letterSpacing: "0.02em",
                        }}>{pill.label}</div>
                      ))}
                    </div>

                    {/* Footer row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.8rem", color: lessonTotal > 0 ? color : "rgba(255,255,255,0.2)", fontWeight: lessonTotal > 0 ? 600 : 400 }}>
                        {lessonTotal > 0 ? `${lessonTotal} pts earned` : "Up to 100 pts"}
                      </span>
                      <span style={{
                        fontSize: "0.78rem", color: "rgba(255,255,255,0.35)",
                        display: "flex", alignItems: "center", gap: "0.3rem",
                      }}>
                        Open lesson <span style={{ fontSize: "0.9rem" }}>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer style={{
        position: "relative", zIndex: 10,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "1.1rem 4rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.15)" }}>© 2025 Cosmo</span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <button className="footer-link" onClick={() => navigate("/about")}>About</button>
          <button className="footer-link" onClick={() => navigate("/terms")}>Terms</button>
        </div>
      </footer>
    </div>
  );
}