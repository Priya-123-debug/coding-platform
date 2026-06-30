import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosClient from "../utilis/axiosClient";
import Navbar from "./Navbar";
import { CheckCircle, Circle, Mail, Calendar, Award } from "lucide-react";

const diffMap = {
  easy:   { cls: "badge-easy",   label: "Easy" },
  medium: { cls: "badge-medium", label: "Medium" },
  hard:   { cls: "badge-hard",   label: "Hard" },
};

const Profile = () => {
  const { user } = useSelector((s) => s.auth);
  const [problems, setProblems] = useState([]);
  const [solved, setSolved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosClient.get("/problem/getallproblem"),
      axiosClient.get("/problem/problemsolvedbyuser"),
    ])
      .then(([allRes, solvedRes]) => {
        setProblems(allRes.data);
        setSolved(solvedRes.data.user.problemsolved || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = problems.length;
  const solvedCount = solved.length;
  const pct = total ? Math.round((solvedCount / total) * 100) : 0;

  const byDifficulty = { easy: 0, medium: 0, hard: 0 };
  solved.forEach(p => {
    const d = p.difficulty?.trim().toLowerCase();
    if (byDifficulty[d] !== undefined) byDifficulty[d]++;
  });

  const totalByDifficulty = { easy: 0, medium: 0, hard: 0 };
  problems.forEach(p => {
    const d = p.difficulty?.trim().toLowerCase();
    if (totalByDifficulty[d] !== undefined) totalByDifficulty[d]++;
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Navbar />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1.5rem 1rem 3rem" }}>

        {/* Profile header card */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "1.75rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.6rem", fontWeight: 700, color: "#fff", flexShrink: 0,
          }}>
            {(user?.firstname?.[0] || user?.email?.[0] || "U").toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>{user?.firstname || "User"}</h1>
            <p style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0.35rem 0 0", wordBreak: "break-all" }}>
              <Mail size={13} /> {user?.email}
            </p>
            {user?.role && (
              <span style={{ display: "inline-block", marginTop: "0.5rem", background: "rgba(247,129,102,0.12)", color: "var(--accent)", border: "1px solid rgba(247,129,102,0.3)", borderRadius: "20px", padding: "0.15rem 0.65rem", fontSize: "0.72rem", fontWeight: 600, textTransform: "capitalize" }}>
                {user.role}
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>Loading stats…</div>
        ) : (
          <>
            {/* Stats row */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "1rem 1.5rem", flex: "1 1 140px" }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem", margin: 0, fontWeight: 600 }}>Solved</p>
                <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0.25rem 0 0", color: "var(--green)" }}>
                  {solvedCount} <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 400 }}>/ {total}</span>
                </p>
              </div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "1rem 1.5rem", flex: "1 1 140px" }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem", margin: 0, fontWeight: 600 }}>Completion</p>
                <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0.25rem 0 0", color: "var(--accent-2)" }}>{pct}%</p>
              </div>
            </div>

            {/* Difficulty breakdown */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <p style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 600, fontSize: "0.9rem", margin: "0 0 1rem" }}>
                <Award size={15} /> Progress by Difficulty
              </p>
              {["easy", "medium", "hard"].map(d => {
                const count = byDifficulty[d];
                const tot = totalByDifficulty[d] || 1;
                const p = Math.round((count / tot) * 100);
                const color = d === "easy" ? "var(--green)" : d === "medium" ? "var(--yellow)" : "var(--red)";
                return (
                  <div key={d} style={{ marginBottom: "0.85rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                      <span style={{ textTransform: "capitalize", color: "var(--text-primary)", fontWeight: 500 }}>{d}</span>
                      <span style={{ color: "var(--text-secondary)" }}>{count} / {totalByDifficulty[d]}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 4, background: "var(--bg-secondary)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${p}%`, background: color, borderRadius: 4, transition: "width 0.3s" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Solved problems list */}
            <div>
              <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: "0 0 0.75rem" }}>Solved Problems</p>
              {solved.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px" }}>
                  No problems solved yet. <Link to="/" style={{ color: "var(--accent-2)" }}>Start solving →</Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {solved.map(p => {
                    const diff = p.difficulty?.trim().toLowerCase();
                    const dc = diffMap[diff];
                    return (
                      <Link key={p._id} to={`/problem/${p._id}`} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px",
                        padding: "0.75rem 1rem", textDecoration: "none", color: "var(--text-primary)",
                        transition: "border-color 0.15s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#484f58"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.88rem", fontWeight: 500 }}>
                          <CheckCircle size={15} color="var(--green)" /> {p.title}
                        </span>
                        {dc && <span className={`badge ${dc.cls}`}>{dc.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;