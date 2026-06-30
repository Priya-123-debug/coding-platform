import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosClient from "../utilis/axiosClient";
import Navbar from "./Navbar";
import { CheckCircle, Circle, Search } from "lucide-react";

const tagColors = {
  array:      { bg: "rgba(121,192,255,0.15)", color: "#79c0ff" },
  linkedlist: { bg: "rgba(188,140,255,0.15)", color: "#bc8cff" },
  graph:      { bg: "rgba(247,129,102,0.15)", color: "#f78166" },
  dp:         { bg: "rgba(126,231,135,0.15)", color: "#7ee787" },
};

const diffMap = {
  easy:   { cls: "badge-easy",   label: "Easy" },
  medium: { cls: "badge-medium", label: "Medium" },
  hard:   { cls: "badge-hard",   label: "Hard" },
};

const Homepage = () => {
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solved, setSolved] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ difficulty: "all", tag: "all", status: "all" });

  useEffect(() => {
    axiosClient.get("/problem/getallproblem").then(r => setProblems(r.data)).catch(console.error);
    if (user) axiosClient.get("/problem/problemsolvedbyuser").then(r => setSolved(r.data.user.problemsolved)).catch(console.error);
  }, [user]);

  const filteredProblems = problems.filter(p => {
    const isSolved = Array.isArray(solved) && solved.some(sp => sp._id === p._id);
    return (
      (filter.difficulty === "all" || p.difficulty === filter.difficulty) &&
      (filter.tag === "all" || (Array.isArray(p.tags) ? p.tags.includes(filter.tag) : p.tags === filter.tag)) &&
      (filter.status === "all" || (filter.status === "solved" && isSolved)) &&
      (!search || p.title?.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const totalSolved = Array.isArray(solved) ? solved.length : 0;
  const pct = problems.length ? Math.round((totalSolved / problems.length) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Navbar filter={filter} setfilter={setFilter} isUser={user?.role === "user"} />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1.75rem 1rem 3rem" }}>

        {/* Stats */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {[
            { label: "Solved", value: `${totalSolved} / ${problems.length}`, color: "var(--green)" },
            { label: "Completion", value: `${pct}%`, color: "var(--accent-2)" },
          ].map(s => (
            <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "1rem 1.5rem", flex: "1 1 160px" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem", margin: 0, fontWeight: 500 }}>{s.label}</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0.25rem 0 0", color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "1.25rem" }}>
          <Search size={15} color="var(--text-secondary)" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }} />
          <input type="text" placeholder="Search problems..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "8px", padding: "0.6rem 1rem 0.6rem 2.4rem", color: "var(--text-primary)", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "var(--accent-2)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "2rem 1fr 7rem 8rem 2.5rem", gap: "0.5rem", padding: "0.4rem 1rem", color: "var(--text-secondary)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          <span>#</span><span>Title</span><span>Difficulty</span><span>Tags</span><span></span>
        </div>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {filteredProblems.length === 0 && (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px" }}>
              No problems match your filters.
            </div>
          )}
          {filteredProblems.map((p, idx) => {
            const diff = p.difficulty?.trim().toLowerCase();
            const dc = diffMap[diff];
            const isSolved = Array.isArray(solved) && solved.some(sp => sp._id === p._id);
            const tags = Array.isArray(p.tags) ? p.tags : [p.tags].filter(Boolean);

            return (
              <div key={p._id} style={{
                display: "grid", gridTemplateColumns: "2rem 1fr 7rem 8rem 2.5rem",
                gap: "0.5rem", alignItems: "center",
                background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "0.85rem 1rem",
                transition: "border-color 0.15s, background 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.borderColor = "#484f58"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-card)"; e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <span style={{ color: "var(--text-secondary)", fontSize: "0.78rem" }}>{idx + 1}</span>

                <Link to={`/problem/${p._id}`} style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--accent-2)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-primary)"}
                >
                  {p.title}
                </Link>

                <span>
                  {dc
                    ? <span className={`badge ${dc.cls}`}>{dc.label}</span>
                    : <span className="badge" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)" }}>{p.difficulty}</span>
                  }
                </span>

                <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                  {tags.slice(0, 2).map(tag => {
                    const tc = tagColors[tag?.toLowerCase()] || { bg: "rgba(255,255,255,0.08)", color: "var(--text-secondary)" };
                    return (
                      <span key={tag} style={{ background: tc.bg, color: tc.color, borderRadius: "12px", padding: "0.15rem 0.5rem", fontSize: "0.68rem", fontWeight: 600 }}>{tag}</span>
                    );
                  })}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  {isSolved ? <CheckCircle size={16} color="var(--green)" /> : <Circle size={16} color="var(--border)" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Homepage;