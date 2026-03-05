import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcon";
import StarsBg from "../components/bg";

export default function Auth() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
          setError("Please enter your email address, not your username.");
          setLoading(false);
          return;
        }
        await login(form.email, form.password);
        navigate("/home");
      } else {
        await register(form.username, form.email, form.password);
        await login(form.email, form.password);
        navigate("/home");
      }
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "system-ui, sans-serif", color: "white", display: "flex", flexDirection: "column", position: "relative" }}>
      <style>{`
        * { box-sizing: border-box; }
        .auth-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 0.7rem 0.9rem; color: white; font-family: inherit; font-size: 0.9rem; outline: none; transition: border-color 0.15s; }
        .auth-input:focus { border-color: #6366f1; }
        .auth-input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>

      <StarsBg />

      <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", padding: "1.1rem 3rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span onClick={() => navigate("/")} style={{ fontWeight: 700, fontSize: "1rem", cursor: "pointer", letterSpacing: "-0.01em" }}>Cosmo</span>
      </nav>

      <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.4rem", letterSpacing: "-0.02em" }}>
            {tab === "login" ? "Log in to Cosmo" : "Create an account"}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", marginBottom: "1.75rem" }}>
            {tab === "login" ? "Enter your email and password to continue." : "Fill in the details below to get started."}
          </p>

          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "0.2rem", marginBottom: "1.5rem", backdropFilter: "blur(8px)" }}>
            {(["login", "register"] as const).map((t) => (
              <button key={t} onClick={() => { setTab(t); setError(""); }} style={{
                flex: 1, width: "50%", padding: "0.5rem", borderRadius: "6px", border: "none",
                cursor: "pointer", fontFamily: "inherit", fontWeight: 500, fontSize: "0.85rem",
                background: tab === t ? "#4f46e5" : "transparent",
                color: tab === t ? "white" : "rgba(255,255,255,0.35)",
              }}>
                {t === "login" ? "Log in" : "Register"}
              </button>
            ))}
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "1.75rem", backdropFilter: "blur(12px)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {tab === "register" && (
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.35rem" }}>Username</label>
                  <input className="auth-input" placeholder="e.g. spacekid42" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                </div>
              )}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.35rem" }}>Email</label>
                <input className="auth-input" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.35rem" }}>Password</label>
                <input className="auth-input" type="password" placeholder="at least 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
              </div>

              {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "6px", padding: "0.7rem 0.9rem", fontSize: "0.82rem", color: "#fca5a5" }}>{error}</div>
              )}

              <button onClick={handleSubmit} disabled={loading} style={{
                marginTop: "0.25rem", background: "#4f46e5", border: "none",
                color: "white", padding: "0.75rem", borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
                fontWeight: 600, fontSize: "0.9rem", width: "100%", opacity: loading ? 0.6 : 1,
              }}>
                {loading ? "Please wait..." : tab === "login" ? "Log in" : "Create account"}
              </button>
            </div>
          </div>

          <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.82rem", color: "rgba(255,255,255,0.25)" }}>
            {tab === "login" ? "No account? " : "Already registered? "}
            <span onClick={() => setTab(tab === "login" ? "register" : "login")} style={{ color: "#818cf8", cursor: "pointer" }}>
              {tab === "login" ? "Register" : "Log in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}