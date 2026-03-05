import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcon";

const LOGO = "/vite.svg";

interface NavbarProps {
  links?: { label: string; to: string }[];
  homeRoute?: string;
}

export default function Navbar({ links, homeRoute }: NavbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = links ?? [
    { label: "About", to: "/about" },
    { label: "Terms", to: "/terms" },
  ];

  const home = homeRoute ?? (user ? "/home" : "/");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');
        .cosmo-nav-link {
          background: none; border: none;
          color: rgba(255,255,255,0.45); cursor: pointer;
          font-family: inherit; font-size: 0.85rem; padding: 0;
          letter-spacing: 0.01em;
          transition: color 0.15s;
        }
        .cosmo-nav-link:hover { color: rgba(255,255,255,0.9); }
        .cosmo-logout {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.45);
          padding: 0.4rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.82rem;
          letter-spacing: 0.02em;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .cosmo-logout:hover {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.3);
          color: #fca5a5;
        }
      `}</style>

      <nav style={{
        position: "relative", zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 3rem",
        height: 64,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(6,6,16,0.7)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}>

        {/* Logo + wordmark */}
        <div
          onClick={() => navigate(home)}
          style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", flexShrink: 0 }}
        >
          <div style={{
            width: 34, height: 34,
            borderRadius: 8,
            overflow: "hidden",
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <img src={LOGO} alt="Cosmo" style={{ width: 50, height: 50 }} />
          </div>
          <span style={{
            fontFamily: "'Michroma', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "1.15rem",
            letterSpacing: "0.12em",
            background: "linear-gradient(90deg, #fff 30%, #a5b4fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            COSMO
          </span>
        </div>

        {/* Centre links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {navLinks.map((l) => (
            <button key={l.to} className="cosmo-nav-link" onClick={() => navigate(l.to)}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexShrink: 0 }}>
          {user && (
            <>
              <span style={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.02em",
              }}>
                {user.name}
              </span>
              <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
              <button className="cosmo-logout" onClick={() => { logout(); navigate("/"); }}>
                Log out
              </button>
            </>
          )}
          {!user && (
            <button
              onClick={() => navigate("/auth")}
              style={{
                background: "#4f46e5", border: "none", color: "white",
                padding: "0.4rem 1.1rem", borderRadius: "6px",
                cursor: "pointer", fontFamily: "inherit", fontSize: "0.82rem",
                fontWeight: 600,
              }}
            >
              Log in
            </button>
          )}
        </div>
      </nav>
    </>
  );
}