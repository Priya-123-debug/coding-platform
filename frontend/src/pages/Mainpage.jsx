import React from "react";
import { Link } from "react-router-dom";
import CodeTyping from "./CodeTyping";

const features = [
  { icon: "⚡", title: "Instant Execution", desc: "Run C++, Python, Java, and JavaScript in milliseconds with live feedback." },
  { icon: "🎯", title: "Curated Problems", desc: "Hand-picked problems across arrays, graphs, DP, and more — ordered by skill level." },
  { icon: "📊", title: "Track Progress", desc: "See which problems you've solved, filter by status, difficulty, and topic." },
];

export default function Mainpage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "'Inter', sans-serif" }}>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(13,17,23,0.85)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 1.5rem", height: "60px",
      }}>
        <span style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
          <span style={{ color: "var(--accent)" }}>&lt;</span>Code<span style={{ color: "var(--accent)" }}>/&gt;</span> Platform
        </span>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/login" style={{ padding: "0.45rem 1rem", borderRadius: "6px", border: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 500, textDecoration: "none" }}>Log in</Link>
          <Link to="/signup" style={{ padding: "0.45rem 1rem", borderRadius: "6px", background: "var(--accent)", color: "#fff", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>Sign up free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem 1.5rem 3rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }} className="hero-grid">
        <div>
          <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1rem" }}>🚀 Competitive Coding Platform</p>
          <h1 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.03em", margin: 0 }}>
            Practice Coding.<br />
            <span style={{ color: "var(--accent-2)" }}>Ace Interviews.</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "1.25rem", lineHeight: 1.7, fontSize: "1rem", maxWidth: "420px" }}>
            Solve real interview problems, run code instantly in 4 languages, and track your progress — all in one place.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem", flexWrap: "wrap" }}>
            <Link to="/signup" style={{ padding: "0.7rem 1.5rem", borderRadius: "8px", background: "var(--accent)", color: "#fff", fontWeight: 600, textDecoration: "none", fontSize: "0.9rem" }}>Start Coding →</Link>
            <Link to="/login" style={{ padding: "0.7rem 1.5rem", borderRadius: "8px", border: "1px solid var(--border)", color: "var(--text-primary)", fontWeight: 500, textDecoration: "none", fontSize: "0.9rem" }}>Log in</Link>
          </div>
        </div>

        {/* Code preview panel */}
        <div style={{ background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)", padding: "0.6rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f85149", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#d29922", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3fb950", display: "inline-block" }} />
            <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>solution.cpp</span>
          </div>
          <div style={{ padding: "1.25rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", minHeight: "200px" }}>
            <CodeTyping />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem", display: "flex", justifyContent: "center", gap: "4rem", flexWrap: "wrap" }}>
          {[["100+", "Problems"], ["4", "Languages"], ["Fast", "Code Runner"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--accent-2)" }}>{num}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>Everything you need to level up</h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "3rem" }}>Built for students, competitive programmers, and job seekers.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {features.map(f => (
            <div key={f.title} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "1.5rem", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{f.icon}</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.4rem" }}>{f.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", textAlign: "center", padding: "4rem 1.5rem" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Ready to start coding?</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.75rem", marginBottom: "2rem" }}>Create your free account and start solving in minutes.</p>
        <Link to="/signup" style={{ padding: "0.8rem 2rem", borderRadius: "8px", background: "var(--accent)", color: "#fff", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none" }}>
          Create Free Account
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.8rem", borderTop: "1px solid var(--border)" }}>
        © 2026 CodePlatform. All rights reserved.
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}