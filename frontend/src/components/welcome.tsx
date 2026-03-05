import { useState, useEffect } from "react";
import { useAuth } from "../context/Authcon";

export default function WelcomeModal() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!user) return;
    if (!localStorage.getItem(`welcomed_${user.id}`)) setVisible(true);
  }, [user]);

  const dismiss = () => {
    if (!user) return;
    localStorage.setItem(`welcomed_${user.id}`, "true");
    setVisible(false);
  };

  if (!visible) return null;

  const steps = [
    { title: `Welcome to Cosmo, ${user?.name}`, body: "Cosmo is an AI-powered space science learning platform. You have four in-depth lessons covering the Solar System, Mars, black holes, and the life cycle of stars." },
    { title: "How learning works", body: "Each lesson has three parts: read the content, ask the AI tutor questions, then take a quiz. Complete all three to earn your full score for that lesson." },
    { title: "Your AI tutor", body: "The AI tutor answers questions strictly based on the lesson content. Ask about definitions, concepts, or anything you did not understand while reading." },
    { title: "Points and progress", body: "You earn 50 points for reading and up to 50 more for quiz performance — 100 points per lesson, 400 total. Your progress is saved automatically." },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "rgba(15,15,30,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "2rem", maxWidth: 440, width: "100%", fontFamily: "system-ui, sans-serif", color: "white", backdropFilter: "blur(16px)" }}>
        <div style={{ display: "flex", gap: "0.35rem", marginBottom: "1.75rem" }}>
          {steps.map((_, i) => (
            <div key={i} style={{ height: 2, borderRadius: "999px", flex: i === step ? 2 : 1, background: i === step ? "#6366f1" : "rgba(255,255,255,0.12)", transition: "flex 0.2s" }} />
          ))}
        </div>

        <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.7rem", letterSpacing: "-0.01em" }}>{current.title}</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "1.75rem" }}>{current.body}</p>

        <div style={{ display: "flex", gap: "0.6rem" }}>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: "0.65rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.88rem" }}>Back</button>
          )}
          <button onClick={isLast ? dismiss : () => setStep(step + 1)} style={{ flex: 2, padding: "0.65rem", background: isLast ? "#4f46e5" : "rgba(255,255,255,0.07)", border: `1px solid ${isLast ? "#6366f1" : "rgba(255,255,255,0.1)"}`, borderRadius: "6px", color: "white", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: "0.88rem" }}>
            {isLast ? "Get started" : "Next"}
          </button>
        </div>

        {!isLast && (
          <button onClick={dismiss} style={{ display: "block", margin: "0.85rem auto 0", background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem" }}>Skip</button>
        )}
      </div>
    </div>
  );
}