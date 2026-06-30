import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../utilis/axiosClient";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

const diffStyle = {
  easy:   { background: "rgba(63,185,80,0.12)",  color: "var(--green)",  border: "1px solid rgba(63,185,80,0.3)" },
  medium: { background: "rgba(210,153,34,0.12)", color: "var(--yellow)", border: "1px solid rgba(210,153,34,0.3)" },
  hard:   { background: "rgba(248,81,73,0.12)",  color: "var(--red)",    border: "1px solid rgba(248,81,73,0.3)" },
};

const AdminProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get("/problem/getallproblem")
      .then(r => setProblems(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const deleteProblem = async id => {
    if (!window.confirm("Delete this problem? This cannot be undone.")) return;
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(prev => prev.filter(p => p._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0 }}>Problems</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", margin: "0.2rem 0 0" }}>{problems.length} total</p>
        </div>
        <Link to="/admin/create" style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "var(--accent)", color: "#fff", borderRadius: "8px", padding: "0.55rem 1rem", textDecoration: "none", fontWeight: 600, fontSize: "0.85rem" }}>
          <PlusCircle size={15} /> New Problem
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>Loading…</div>
      ) : problems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-secondary)" }}>
          No problems yet. <Link to="/admin/create" style={{ color: "var(--accent-2)" }}>Create the first one.</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 110px", gap: "1rem", padding: "0.4rem 1rem", color: "var(--text-secondary)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            <span>Title</span><span>Difficulty</span><span style={{ textAlign: "right" }}>Actions</span>
          </div>
          {problems.map(p => {
            const diff = p.difficulty?.trim().toLowerCase();
            const ds = diffStyle[diff] || {};
            return (
              <div key={p._id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 110px", gap: "1rem", alignItems: "center", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "0.9rem 1rem", transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#484f58"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{p.title}</span>
                <span style={{ ...ds, borderRadius: "20px", padding: "0.2rem 0.65rem", fontSize: "0.73rem", fontWeight: 600, width: "fit-content" }}>{p.difficulty}</span>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                  <Link to={`/admin/edit/${p._id}`} style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--accent-2)", textDecoration: "none", fontSize: "0.8rem", fontWeight: 500 }}>
                    <Pencil size={13} /> Edit
                  </Link>
                  <button onClick={() => deleteProblem(p._id)} style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--red)", background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 500 }}>
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminProblemList;