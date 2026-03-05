import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcon";
import StarsBg from "../components/bg";
import Navbar from "../components/NavBar";

const termsSections = [
  { title: "1. Acceptance of Terms", content: "By accessing or using Cosmo, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the platform." },
  { title: "2. Use of the Platform", content: "Cosmo is an educational platform intended for students aged 13 and above. You agree to use the platform solely for educational purposes." },
  { title: "3. User Accounts", content: "You are responsible for maintaining the confidentiality of your account credentials and agree to provide accurate information when registering." },
  { title: "4. AI-Generated Content", content: "Cosmo uses Google Gemini AI to power the AI tutor and generate quiz questions. AI responses are grounded in lesson content but may occasionally contain inaccuracies and should be treated as educational guidance." },
  { title: "5. Intellectual Property", content: "All lesson content, interface design, and platform code are the intellectual property of Cosmo. You may not reproduce or distribute any platform content without explicit permission." },
  { title: "6. Privacy and Data", content: "Cosmo collects your username, email address, and learning progress. This data is used solely to provide your learning experience and is not sold or shared with third parties." },
  { title: "7. Limitation of Liability", content: "Cosmo is provided on an as-is basis for educational purposes. To the maximum extent permitted by law, Cosmo shall not be liable for any indirect or consequential damages." },
  { title: "8. Changes to Terms", content: "We reserve the right to update these terms at any time. Continued use of the platform constitutes acceptance of updated terms." },
];

const privacySections = [
  { title: "What we collect", content: "We collect your username, email address, hashed password, lesson progress records, and quiz scores." },
  { title: "How we use it", content: "Your data is used exclusively to provide your personalised learning experience. We do not use your data for advertising or profiling." },
  { title: "AI interactions", content: "Messages sent to the AI tutor are processed by Google Gemini AI and are subject to Google's privacy policy. Chat history is not stored on our servers." },
  { title: "Data retention", content: "Your account and progress data is retained while your account is active. You may request deletion at any time." },
];

export default function Terms() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "system-ui, sans-serif", color: "white", position: "relative" }}>
      <style>{`
        * { box-sizing: border-box; }
        .footer-link { background: none; border: none; color: rgba(255,255,255,0.25); cursor: pointer; font-family: inherit; font-size: 0.8rem; padding: 0; transition: color 0.15s; }
        .footer-link:hover { color: rgba(255,255,255,0.55); }
        .terms-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 1.35rem 1.5rem;
          backdrop-filter: blur(10px);
          transition: background 0.15s;
        }
        .terms-card:hover { background: rgba(255,255,255,0.05); }
      `}</style>

      <StarsBg />
      <Navbar links={[{ label: "About", to: "/about" }]} homeRoute={user ? "/home" : "/"} />
      <main style={{
        position: "relative", zIndex: 10,
        maxWidth: 1100, margin: "0 auto",
        padding: "3.5rem 4rem 5rem",
      }}>

        {/*header*/}
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.5rem" }}>Legal</p>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: "0.35rem" }}>Terms & Privacy</h1>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.82rem" }}>Last updated March 2025</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>

          <div>
            <div style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#a5b4fc", marginBottom: "1rem" }}>
              Terms of Use
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {termsSections.map((s, i) => (
                <div key={i} className="terms-card">
                  <div style={{ fontWeight: 600, fontSize: "0.82rem", marginBottom: "0.45rem", color: "#c4b5fd" }}>{s.title}</div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", lineHeight: 1.7, margin: 0 }}>{s.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/*Privacy*/}
          <div>
            <div style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#a5b4fc", marginBottom: "1rem" }}>
              Privacy Notice
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "2rem" }}>
              {privacySections.map((s, i) => (
                <div key={i} className="terms-card">
                  <div style={{ fontWeight: 600, fontSize: "0.82rem", marginBottom: "0.45rem", color: "#c4b5fd" }}>{s.title}</div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", lineHeight: 1.7, margin: 0 }}>{s.content}</p>
                </div>
              ))}
            </div>

            {/*Summary box*/}
            <div style={{
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "12px",
              padding: "1.5rem",
              backdropFilter: "blur(10px)",
            }}>
              <div style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.6rem", color: "#a5b4fc" }}>
                The short version
              </div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", lineHeight: 1.7, margin: "0 0 1rem" }}>
                We collect only what we need to run your account and track progress. We don't sell data, we don't advertise. Chat messages are processed by Google Gemini and not stored on our servers.
              </p>
              {!user && (
                <button onClick={() => navigate("/auth")} style={{ background: "#4f46e5", border: "none", color: "white", padding: "0.6rem 1.5rem", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: "0.82rem" }}>
                  Get started
                </button>
              )}
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "3rem", color: "rgba(255,255,255,0.1)", fontSize: "0.75rem" }}>
          By using Cosmo you agree to these terms.
        </p>
      </main>

      <footer style={{
        position: "relative", zIndex: 10,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "1.1rem 4rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.15)" }}>© 2025 Cosmo</span>
        <button className="footer-link" onClick={() => navigate("/about")}>About</button>
      </footer>
    </div>
  );
}