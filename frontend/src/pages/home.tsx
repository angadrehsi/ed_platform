import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcon";
import StarsBg from "../components/bg";
import Navbar from "../components/NavBar";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={{
      minHeight: "100vh", background: "#060610",
      fontFamily: "system-ui, sans-serif", color: "white",
      display: "flex", flexDirection: "column", position: "relative",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        .footer-link { background: none; border: none; color: rgba(255,255,255,0.25); cursor: pointer; font-family: inherit; font-size: 0.8rem; padding: 0; transition: color 0.15s; }
        .footer-link:hover { color: rgba(255,255,255,0.55); }
        .feature-tile {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          padding: 1.5rem 1.75rem;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          cursor: pointer;
          text-align: left;
        }
        .feature-tile:hover {
          background: rgba(99,102,241,0.08);
          border-color: rgba(99,102,241,0.3);
          transform: translateY(-2px);
        }
        .cta-btn {
          background: #4f46e5;
          border: none; color: white;
          padding: 0.85rem 2.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 0.02em;
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 0 32px rgba(79,70,229,0.35);
        }
        .cta-btn:hover {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 0 48px rgba(79,70,229,0.5);
        }
      `}</style>

      <StarsBg />
      <Navbar />

      {/* Hero */}
      <main style={{
        position: "relative", zIndex: 10, flex: 1,
        display: "flex", flexDirection: "column",
        maxWidth: 1280, width: "100%", margin: "0 auto",
        padding: "0 4rem",
      }}>

        {/* Hero row */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          gap: "3rem",
          paddingTop: "5rem", paddingBottom: "4rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          {/* Left */}
          <div style={{ maxWidth: 520 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: "999px",
              padding: "0.3rem 0.9rem",
              fontSize: "0.72rem",
              color: "#a5b4fc",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8", flexShrink: 0 }} />
              Space Science Platform
            </div>

            <h1 style={{
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "1.25rem",
            }}>
              Welcome back,{" "}
              <span style={{
                background: "linear-gradient(90deg, #818cf8, #c4b5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {user?.name}
              </span>
            </h1>

            <p style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "1.05rem",
              lineHeight: 1.75,
              marginBottom: "2.25rem",
              maxWidth: 440,
            }}>
              Read in-depth lessons, ask the AI tutor anything, and complete quizzes to track your score across the universe.
            </p>

            <button className="cta-btn" onClick={() => navigate("/dashboard")}>
              Go to dashboard →
            </button>
          </div>
        </div>

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

      <footer style={{
        position: "relative", zIndex: 10,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "1.1rem 4rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "0.75rem",
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