import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../utilis/axiosClient";
import Navbar from "./Navbar";
import { ChevronDown, ChevronUp, Clock, Cpu, ChevronLeft, ChevronRight } from "lucide-react";

const statusColor = {
  Accepted: "var(--green)",
  Failed: "var(--red)",
  "Wrong Answer": "var(--red)",
  "Time Limit": "var(--yellow)",
  "Compilation Error": "var(--red)",
  "Runtime Error": "var(--red)",
  pending: "var(--text-secondary)",
};

const langLabel = { cpp: "C++", python: "Python", java: "Java", javascript: "JavaScript" };
const PAGE_SIZE = 10;

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, hasNextPage: false, hasPrevPage: false });
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchPage = (page) => {
    setLoading(true);
    axiosClient.get(`/problem/allsubmissions?page=${page}&limit=${PAGE_SIZE}`)
      .then(r => {
        setSubmissions(r.data.submissions);
        setPagination(r.data.pagination);
        setExpanded(null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPage(1); }, []);

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const goToPage = (p) => {
    if (p < 1 || p > pagination.totalPages || p === pagination.page) return;
    fetchPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate compact page number list e.g. [1, '...', 4, 5, 6, '...', 12]
  const getPageNumbers = () => {
    const { page, totalPages } = pagination;
    const pages = [];
    const delta = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Navbar />

      <div style={{ maxWidth: "850px", margin: "0 auto", padding: "1.5rem 1rem 3rem" }}>
        <h1 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.25rem" }}>My Submissions</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          {pagination.total} submission{pagination.total !== 1 ? "s" : ""}
        </p>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>Loading…</div>
        ) : submissions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-secondary)" }}>
            No submissions yet. <Link to="/" style={{ color: "var(--accent-2)" }}>Solve a problem →</Link>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {submissions.map(sub => {
                const isOpen = expanded === sub._id;
                const color = statusColor[sub.status] || "var(--text-secondary)";
                return (
                  <div key={sub._id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
                    <button onClick={() => setExpanded(isOpen ? null : sub._id)} style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "none", border: "none", cursor: "pointer", padding: "0.9rem 1rem", textAlign: "left",
                      flexWrap: "wrap", gap: "0.5rem",
                    }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", minWidth: 0 }}>
                        <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                          {sub.problemId?.title || "Deleted Problem"}
                        </span>
                        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ color, fontWeight: 700, fontSize: "0.78rem" }}>{sub.status}</span>
                          <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>•</span>
                          <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace" }}>{langLabel[sub.language] || sub.language}</span>
                          <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>•</span>
                          <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>{formatDate(sub.createdAt)}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                          {sub.testCasepassed ?? 0}/{sub.testCasetotal ?? 0}
                        </span>
                        {isOpen ? <ChevronUp size={16} color="var(--text-secondary)" /> : <ChevronDown size={16} color="var(--text-secondary)" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div style={{ borderTop: "1px solid var(--border)", padding: "1rem", background: "var(--bg-secondary)" }}>
                        <div style={{ display: "flex", gap: "1.25rem", marginBottom: "0.85rem", flexWrap: "wrap", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Clock size={13} /> {sub.runtime ?? 0}ms</span>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Cpu size={13} /> {sub.memory ?? 0} KB</span>
                        </div>
                        {sub.errormessage && (
                          <div style={{ background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.3)", borderRadius: "8px", padding: "0.65rem 0.85rem", marginBottom: "0.85rem", color: "var(--red)", fontSize: "0.78rem", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-wrap" }}>
                            {sub.errormessage}
                          </div>
                        )}
                        <pre style={{
                          background: "#0d1117", border: "1px solid var(--border)", borderRadius: "8px",
                          padding: "0.85rem", overflowX: "auto", fontSize: "0.78rem",
                          fontFamily: "'JetBrains Mono', monospace", color: "var(--text-primary)", margin: 0,
                        }}>
                          {sub.code}
                        </pre>
                        {sub.problemId?._id && (
                          <Link to={`/problem/${sub.problemId._id}`} style={{ display: "inline-block", marginTop: "0.85rem", color: "var(--accent-2)", fontSize: "0.8rem", textDecoration: "none", fontWeight: 600 }}>
                            Open problem →
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination controls */}
            {pagination.totalPages > 1 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", marginTop: "1.75rem", flexWrap: "wrap" }}>
                <button
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.25rem",
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    color: pagination.hasPrevPage ? "var(--text-primary)" : "var(--text-secondary)",
                    borderRadius: "6px", padding: "0.4rem 0.65rem", fontSize: "0.8rem",
                    cursor: pagination.hasPrevPage ? "pointer" : "not-allowed",
                    opacity: pagination.hasPrevPage ? 1 : 0.4,
                  }}
                >
                  <ChevronLeft size={14} /> Prev
                </button>

                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} style={{ color: "var(--text-secondary)", padding: "0 0.3rem", fontSize: "0.8rem" }}>…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      style={{
                        minWidth: "32px", height: "32px",
                        background: p === pagination.page ? "var(--accent)" : "var(--bg-card)",
                        border: "1px solid var(--border)",
                        color: p === pagination.page ? "#fff" : "var(--text-primary)",
                        borderRadius: "6px", fontSize: "0.8rem", fontWeight: p === pagination.page ? 700 : 500,
                        cursor: "pointer",
                      }}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.25rem",
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    color: pagination.hasNextPage ? "var(--text-primary)" : "var(--text-secondary)",
                    borderRadius: "6px", padding: "0.4rem 0.65rem", fontSize: "0.8rem",
                    cursor: pagination.hasNextPage ? "pointer" : "not-allowed",
                    opacity: pagination.hasNextPage ? 1 : 0.4,
                  }}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Submissions;