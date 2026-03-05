import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcon";
import StarsBg from "../components/bg";
import Navbar from "../components/NavBar";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/home");
  }, [user]);

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "system-ui, sans-serif", color: "white", display: "flex", flexDirection: "column", position: "relative" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .btn-primary { background: #4f46e5; border: none; color: white; padding: 0.65rem 1.6rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 600; font-family: inherit; transition: background 0.15s; }
        .btn-primary:hover { background: #4338ca; }
        .btn-ghost { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.6); padding: 0.65rem 1.6rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-family: inherit; transition: background 0.15s, color 0.15s; }
        .btn-ghost:hover { background: rgba(255,255,255,0.1); color: white; }
        .glass-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; backdrop-filter: blur(8px); }
        .glass-card:hover { background: rgba(255,255,255,0.07); border-color: rgba(99,102,241,0.3); }
        .footer-link { background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; font-family: inherit; font-size: 0.8rem; padding: 0; transition: color 0.15s; }
        .footer-link:hover { color: rgba(255,255,255,0.6); }
      `}</style>

      <StarsBg />
      <Navbar homeRoute="/" links={[{ label: "About", to: "/about" }, { label: "Terms", to: "/terms" }]} />

      <main style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 2rem 3rem", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "999px", padding: "0.25rem 0.9rem", fontSize: "0.72rem", color: "#a5b4fc", marginBottom: "1.5rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          AI-Powered Space Education
        </div>

        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", maxWidth: 620, marginBottom: "1.25rem" }}>
          Learn space science with an AI tutor
        </h1>

        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.4)", maxWidth: 440, lineHeight: 1.75, marginBottom: "2.5rem" }}>
          Read lessons, ask questions, take quizzes. Cosmo answers questions based strictly on lesson content.
        </p>

        <button className="btn-primary" onClick={() => navigate("/auth")} style={{ padding: "0.8rem 2.2rem", fontSize: "0.95rem" }}>
          Start learning
        </button>

        {/* Feature */}
        <div style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
          <div style={{
            fontSize: "0.72rem", letterSpacing: "0.1em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
            marginBottom: "1.25rem",
          }}>
            How it works
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
          }}>
            {[
              { step: "01", title: "Read the lesson", desc: "Each lesson is written at secondary school level, covering key concepts with depth. Mark as read to earn 50 points." },
              { step: "02", title: "Ask the AI tutor", desc: "Cosmo answers questions grounded strictly in the lesson content — no hallucinations, no off-topic answers." },
              { step: "03", title: "Take the quiz", desc: "AI-generated questions test your real understanding. Each correct answer earns 10 points up to 50 per lesson." },
            ].map((f) => (
              <div key={f.step} className="feature-tile" onClick={() => navigate("/dashboard")}>
                <div style={{
                  fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em",
                  color: "#6366f1", marginBottom: "0.75rem",
                }}>{f.step}</div>
                <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.5rem" }}>{f.title}</div>
                <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "1.1rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.2)" }}>2025 Cosmo</span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <button className="footer-link" onClick={() => navigate("/about")}>About</button>
          <button className="footer-link" onClick={() => navigate("/terms")}>Terms</button>
        </div>
      </footer>
    </div>
  );
}
