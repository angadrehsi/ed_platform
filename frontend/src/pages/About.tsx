import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcon";
import StarsBg from "../components/bg";
import Navbar from "../components/NavBar";

export default function About() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "system-ui, sans-serif", color: "white", position: "relative" }}>
      <style>{`* { box-sizing: border-box; } .footer-link { background: none; border: none; color: rgba(255,255,255,0.25); cursor: pointer; font-family: inherit; font-size: 0.8rem; padding: 0; } .footer-link:hover { color: rgba(255,255,255,0.5); }`}</style>
      <StarsBg />
      <Navbar links={[{ label: "Terms", to: "/terms" }]} homeRoute={user ? "/home" : "/"} />

      <main style={{ position: "relative", zIndex: 10, maxWidth: 720, margin: "0 auto", padding: "3.5rem 2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: "0.5rem" }}>About Cosmo</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: 520 }}>An AI-powered space science learning platform for students aged 13 and above.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            { title: "Our approach", body: "Cosmo is built on the principle that real learning requires reading, questioning, and testing — not just passive consumption. Every lesson follows a structured flow: read the content, ask the AI tutor questions, then test your understanding with a quiz. Progress is tracked and scored so you can see how far you have come." },
          ].map((s) => (
            <div key={s.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "1.5rem", backdropFilter: "blur(8px)" }}>
              <div style={{ fontWeight: 600, fontSize: "0.92rem", marginBottom: "0.6rem" }}>{s.title}</div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>{s.body}</p>
            </div>
          ))}

          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "1.5rem", backdropFilter: "blur(8px)" }}>
            <div style={{ fontWeight: 600, fontSize: "0.92rem", marginBottom: "1rem" }}>How it works</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {[
                { n: "01", title: "Read", desc: "Each lesson contains detailed content covering key concepts in space science at secondary school level." },
                { n: "02", title: "Ask the AI tutor", desc: "The AI tutor answers questions based strictly on the lesson content, keeping responses accurate and relevant." },
                { n: "03", title: "Take the quiz", desc: "AI-generated questions test your understanding. Each correct answer earns 10 points." },
                { n: "04", title: "Track your score", desc: "50 points for reading, up to 50 for the quiz — 100 points per lesson, 400 total." },
              ].map((item) => (
                <div key={item.n} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "4px", flexShrink: 0, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 700, color: "#a5b4fc" }}>{item.n}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.2rem" }}>{item.title}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "1.5rem", backdropFilter: "blur(8px)" }}>
            <div style={{ fontWeight: 600, fontSize: "0.92rem", marginBottom: "0.75rem" }}>Built with</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["React + TypeScript", "FastAPI", "PostgreSQL", "Google Gemini AI"].map((tech) => (
                <span key={tech} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "999px", padding: "0.25rem 0.75rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>{tech}</span>
              ))}
            </div>
          </div>

          {!user && <button onClick={() => navigate("/auth")} style={{ background: "#4f46e5", border: "none", color: "white", padding: "0.8rem 2rem", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: "0.9rem", alignSelf: "flex-start" }}>Get started</button>}
        </div>
      </main>

      <footer style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "1.1rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.2)" }}>2025 Cosmo</span>
        <button className="footer-link" onClick={() => navigate("/terms")}>Terms</button>
      </footer>
    </div>
  );
}