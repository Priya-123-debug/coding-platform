import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import axiosClient from "../utilis/axiosClient";
import { Link } from "react-router-dom";
import {
  BookOpen, Search, NotebookPen, Circle, CheckCircle2,
  Trash2, ArrowUpRight, Tag, Calendar, ChevronDown, ChevronUp,
} from "lucide-react";

const diffColors = {
  easy:   { bg: "rgba(63,185,80,0.12)",  color: "var(--green)",  border: "rgba(63,185,80,0.3)" },
  medium: { bg: "rgba(210,153,34,0.12)", color: "var(--yellow)", border: "rgba(210,153,34,0.3)" },
  hard:   { bg: "rgba(248,81,73,0.12)",  color: "var(--red)",    border: "rgba(248,81,73,0.3)" },
};

const NoteCard = ({ note, onResolve, onDelete }) => {
  const [expanded, setExpanded] = useState(true);
  const diff = note.problemId?.difficulty?.toLowerCase() || "easy";
  const dc = diffColors[diff] || diffColors.easy;

  return (
    <div style={{
      background: "var(--bg-card)",
      border: `1px solid ${note.resolved ? "rgba(63,185,80,0.25)" : "var(--border)"}`,
      borderRadius: "12px",
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = note.resolved ? "rgba(63,185,80,0.4)" : "#484f58"}
      onMouseLeave={e => e.currentTarget.style.borderColor = note.resolved ? "rgba(63,185,80,0.25)" : "var(--border)"}
    >
      {/* Card top bar - resolved indicator */}
      {note.resolved && (
        <div style={{ height: "3px", background: "linear-gradient(90deg, var(--green), rgba(63,185,80,0.3))" }} />
      )}

      {/* Header */}
      <div style={{ padding: "1.1rem 1.25rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
            <Link to={`/problem/${note.problemId?._id}`} style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--accent-2)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-primary)"}
            >
              {note.problemId?.title || "Unknown Problem"}
            </Link>
            {/* Difficulty badge */}
            <span style={{ background: dc.bg, color: dc.color, border: `1px solid ${dc.border}`, borderRadius: "20px", padding: "0.15rem 0.55rem", fontSize: "0.7rem", fontWeight: 700, textTransform: "capitalize", flexShrink: 0 }}>
              {diff}
            </span>
          </div>

          {/* Tags */}
          {note.problemId?.tags?.length > 0 && (
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {note.problemId.tags.map(tag => (
                <span key={tag} style={{ display: "flex", alignItems: "center", gap: "0.2rem", background: "rgba(121,192,255,0.1)", color: "var(--accent-2)", padding: "0.12rem 0.5rem", borderRadius: "12px", fontSize: "0.68rem", fontWeight: 600 }}>
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          {/* Status pill */}
          <span style={{
            background: note.resolved ? "rgba(63,185,80,0.12)" : "rgba(210,153,34,0.12)",
            color: note.resolved ? "var(--green)" : "var(--yellow)",
            border: `1px solid ${note.resolved ? "rgba(63,185,80,0.3)" : "rgba(210,153,34,0.3)"}`,
            borderRadius: "20px", padding: "0.2rem 0.65rem", fontSize: "0.72rem", fontWeight: 700,
          }}>
            {note.resolved ? "✓ Resolved" : "Pending"}
          </span>

          {/* Expand/collapse */}
          <button onClick={() => setExpanded(p => !p)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "0.25rem" }}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Note body */}
      {expanded && (
        <>
          <div style={{ margin: "0 1.25rem", padding: "1rem", background: "var(--bg-secondary)", borderRadius: "8px", lineHeight: 1.7, fontSize: "0.88rem", color: "var(--text-primary)", whiteSpace: "pre-wrap", borderLeft: "3px solid var(--accent)", fontFamily: "'Inter', sans-serif" }}>
            {note.note}
          </div>

          {/* Footer */}
          <div style={{ padding: "0.85rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-secondary)", fontSize: "0.78rem" }}>
              <Calendar size={13} />
              {new Date(note.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </span>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                disabled={note.resolved}
                onClick={() => onResolve(note._id)}
                style={{
                  background: note.resolved ? "var(--bg-secondary)" : "rgba(63,185,80,0.12)",
                  color: note.resolved ? "var(--text-secondary)" : "var(--green)",
                  border: `1px solid ${note.resolved ? "var(--border)" : "rgba(63,185,80,0.3)"}`,
                  borderRadius: "7px", padding: "0.4rem 0.85rem",
                  cursor: note.resolved ? "default" : "pointer",
                  fontSize: "0.8rem", fontWeight: 600,
                  display: "flex", alignItems: "center", gap: "0.3rem",
                }}
              >
                <CheckCircle2 size={13} />
                {note.resolved ? "Resolved" : "Mark Resolved"}
              </button>

              <button onClick={() => onDelete(note._id)} style={{ background: "rgba(248,81,73,0.1)", color: "var(--red)", border: "1px solid rgba(248,81,73,0.25)", borderRadius: "7px", padding: "0.4rem 0.85rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Trash2 size={13} /> Delete
              </button>

              <Link to={`/problem/${note.problemId?._id}`} style={{ background: "var(--accent)", color: "#fff", textDecoration: "none", borderRadius: "7px", padding: "0.4rem 0.85rem", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <ArrowUpRight size={13} /> Open Problem
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color = "var(--accent)" }) => (
  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem", fontWeight: 600, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</p>
      <h2 style={{ margin: "0.3rem 0 0", color, fontSize: "1.75rem", fontWeight: 700 }}>{value}</h2>
    </div>
    <div style={{ width: 42, height: 42, borderRadius: "10px", background: "var(--bg-secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color }}>
      {icon}
    </div>
  </div>
);

const LearningNotebook = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const { data } = await axiosClient.get("/mistake");
      setNotes(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const markResolved = async (id) => {
    try {
      await axiosClient.patch(`/mistake/${id}`);
      setNotes(prev => prev.map(note => note._id === id ? { ...note, resolved: true } : note));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Delete this learning note?")) return;
    try {
      await axiosClient.delete(`/mistake/${id}`);
      setNotes(prev => prev.filter(note => note._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchSearch =
        note.note?.toLowerCase().includes(search.toLowerCase()) ||
        note.problemId?.title?.toLowerCase().includes(search.toLowerCase());
      if (filter === "resolved") return matchSearch && note.resolved;
      if (filter === "pending") return matchSearch && !note.resolved;
      return matchSearch;
    });
  }, [notes, search, filter]);

  const total = notes.length;
  const resolved = notes.filter(n => n.resolved).length;
  const pending = total - resolved;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Navbar />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "1.75rem 1rem 3rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
            <NotebookPen size={22} color="var(--accent)" />
            <h1 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Learning Notebook</h1>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.87rem", margin: 0 }}>
            Lessons and mistakes saved while solving problems.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <StatCard title="Total Notes" value={total} icon={<BookOpen size={17} />} />
          <StatCard title="Resolved" value={resolved} color="var(--green)" icon={<CheckCircle2 size={17} />} />
          <StatCard title="Pending" value={pending} color="var(--yellow)" icon={<Circle size={17} />} />
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "0.85rem" }}>
          <Search size={14} color="var(--text-secondary)" style={{ position: "absolute", top: "50%", left: "0.85rem", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input className="input-custom" placeholder="Search by problem title or note content…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: "2.4rem" }}
            onFocus={e => e.target.style.borderColor = "var(--accent-2)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
          {[
            { key: "all", label: `All (${total})` },
            { key: "pending", label: `Pending (${pending})` },
            { key: "resolved", label: `Resolved (${resolved})` },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)} style={{
              padding: "0.4rem 1rem", borderRadius: "20px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, transition: "all 0.15s",
              background: filter === key ? "var(--accent)" : "var(--bg-card)",
              color: filter === key ? "#fff" : "var(--text-secondary)",
              border: filter === key ? "1px solid var(--accent)" : "1px solid var(--border)",
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading notebook…</div>
        )}

        {/* Empty */}
        {!loading && filteredNotes.length === 0 && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "3.5rem 2rem", textAlign: "center" }}>
            <NotebookPen size={44} color="var(--accent)" style={{ marginBottom: "1rem", opacity: 0.7 }} />
            <h3 style={{ margin: "0 0 0.4rem", fontSize: "1rem", fontWeight: 600 }}>
              {filter === "all" ? "No notes yet" : `No ${filter} notes`}
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: 0 }}>
              {filter === "all"
                ? "When you learn something while solving a problem, save it here."
                : `You have no ${filter} notes right now.`}
            </p>
          </div>
        )}

        {/* Notes */}
        {!loading && filteredNotes.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {filteredNotes.map(note => (
              <NoteCard key={note._id} note={note} onResolve={markResolved} onDelete={deleteNote} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningNotebook;