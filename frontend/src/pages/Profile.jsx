import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosClient from "../utilis/axiosClient";
import Navbar from "./Navbar";
import {
  CheckCircle, XCircle, Mail, Award, Flame, BookOpen,
  Code2, BarChart3, Trophy, Activity as ActivityIcon,
} from "lucide-react";

const diffMap = {
  easy: { cls: "badge-easy", label: "Easy" },
  medium: { cls: "badge-medium", label: "Medium" },
  hard: { cls: "badge-hard", label: "Hard" },
};

// ---- Heatmap color scale (GitHub style) ----
const levelColor = (level) => {
  switch (level) {
    case 0: return "rgba(255,255,255,0.06)";
    case 1: return "#0e4429";
    case 2: return "#006d32";
    case 3: return "#26a641";
    case 4: return "#39d353";
    default: return "rgba(255,255,255,0.06)";
  }
};

const countToLevel = (count) => {
  if (!count) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 7) return 3;
  return 4;
};

// Build a 53-week x 7-day grid ending today, GitHub-style
function buildHeatmapGrid(heatmapData) {
  const map = new Map(heatmapData.map((d) => [d.date, d.count]));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // find the most recent Saturday to align columns, go back 52 weeks
  const end = new Date(today);
  const daysFromSunday = end.getDay(); // 0 = Sunday
  const totalDays = 53 * 7;
  const start = new Date(end);
  start.setDate(end.getDate() - (totalDays - 1) - (6 - daysFromSunday));

  const weeks = [];
  let cursor = new Date(start);
  for (let w = 0; w < 54; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const key = cursor.toISOString().slice(0, 10);
      const count = map.get(key) || 0;
      week.push({ date: key, count, level: countToLevel(count), inFuture: cursor > today });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

const monthLabelForWeek = (week) => {
  const first = new Date(week[0].date);
  return first.getDate() <= 7 ? first.toLocaleString("default", { month: "short" }) : null;
};

const Card = ({ title, icon, children, style }) => (
  <div
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "1.25rem",
      ...style,
    }}
  >
    {title && (
      <p style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontWeight: 600, fontSize: "0.9rem", margin: "0 0 1rem" }}>
        {icon} {title}
      </p>
    )}
    {children}
  </div>
);

const Bar = ({ label, pct, color }) => (
  <div style={{ marginBottom: "0.85rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
      <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{label}</span>
      <span style={{ color: "var(--text-secondary)" }}>{pct}%</span>
    </div>
    <div style={{ height: 6, borderRadius: 4, background: "var(--bg-secondary)", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 0.4s" }} />
    </div>
  </div>
);

const Profile = () => {
  const { user } = useSelector((s) => s.auth);
  const [problems, setProblems] = useState([]);
  const [solved, setSolved] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [stats, setStats] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [topics, setTopics] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [mistakes, setMistakes] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Core data (required) + analytics endpoints (best-effort, fail gracefully)
    Promise.all([
      axiosClient.get("/problem/getallproblem"),
      axiosClient.get("/problem/problemsolvedbyuser"),
      axiosClient.get("/analytics/heatmap").catch(() => ({ data: [] })),
      axiosClient.get("/analytics/stats").catch(() => ({ data: null })),
      axiosClient.get("/analytics/languages").catch(() => ({ data: [] })),
      axiosClient.get("/analytics/topics").catch(() => ({ data: [] })),
      axiosClient.get("/analytics/achievements").catch(() => ({ data: [] })),
      axiosClient.get("/analytics/mistakes").catch(() => ({ data: [] })),
      axiosClient.get("/analytics/recent").catch(() => ({ data: [] })),
    ])
      .then(([allRes, solvedRes, hmRes, statsRes, langRes, topicRes, achRes, mistRes, recRes]) => {
        setProblems(allRes.data);
        setSolved(solvedRes.data.user.problemsolved || []);
        setHeatmap(hmRes.data || []);
        setStats(statsRes.data);
        setLanguages(langRes.data || []);
        setTopics(topicRes.data || []);
        setAchievements(achRes.data || []);
        setMistakes(mistRes.data || []);
        setRecent(recRes.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = problems.length;
  const solvedCount = solved.length;

  const byDifficulty = { easy: 0, medium: 0, hard: 0 };
  solved.forEach((p) => {
    const d = p.difficulty?.trim().toLowerCase();
    if (byDifficulty[d] !== undefined) byDifficulty[d]++;
  });
  const totalByDifficulty = { easy: 0, medium: 0, hard: 0 };
  problems.forEach((p) => {
    const d = p.difficulty?.trim().toLowerCase();
    if (totalByDifficulty[d] !== undefined) totalByDifficulty[d]++;
  });

  const acceptanceRate = useMemo(() => {
    if (!stats) return null;
    const totalSubs = (stats.accepted || 0) + (stats.wrongAnswer || 0) + (stats.runtimeError || 0) + (stats.compilationError || 0);
    if (!totalSubs) return 0;
    return Math.round(((stats.accepted || 0) / totalSubs) * 100);
  }, [stats]);

  const currentStreak = stats?.currentStreak ?? 0;

  const weeks = useMemo(() => buildHeatmapGrid(heatmap), [heatmap]);
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const statRows = stats
    ? [
        { label: "Accepted", value: stats.accepted ?? 0, color: "var(--green)" },
        { label: "Wrong Answer", value: stats.wrongAnswer ?? 0, color: "var(--red)" },
        { label: "Runtime Error", value: stats.runtimeError ?? 0, color: "var(--yellow)" },
        { label: "Compilation Error", value: stats.compilationError ?? 0, color: "var(--text-secondary)" },
        { label: "Pending", value: stats.pending ?? 0, color: "var(--accent-2)" },
      ]
    : [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Navbar />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1.5rem 1rem 3rem" }}>
        {/* Profile header card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            padding: "1.75rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {(user?.firstname?.[0] || user?.email?.[0] || "U").toUpperCase()}
          </div>
          <div style={{ minWidth: 0, flex: "1 1 200px" }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>{user?.firstname || "User"}</h1>
            <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                color: "var(--text-secondary)",
                fontSize: "0.85rem",
                margin: "0.35rem 0 0",
                wordBreak: "break-all",
              }}
            >
              <Mail size={13} /> {user?.email}
            </p>
            {user?.role && (
              <span
                style={{
                  display: "inline-block",
                  marginTop: "0.5rem",
                  background: "rgba(247,129,102,0.12)",
                  color: "var(--accent)",
                  border: "1px solid rgba(247,129,102,0.3)",
                  borderRadius: "20px",
                  padding: "0.15rem 0.65rem",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                {user.role}
              </span>
            )}
          </div>

          {/* Quick stats inline */}
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 600 }}>Problems Solved</p>
              <p style={{ margin: "0.2rem 0 0", fontSize: "1.4rem", fontWeight: 700, color: "var(--green)" }}>
                {solvedCount}
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 400 }}> / {total}</span>
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 600 }}>Acceptance Rate</p>
              <p style={{ margin: "0.2rem 0 0", fontSize: "1.4rem", fontWeight: 700, color: "var(--accent-2)" }}>
                {acceptanceRate === null ? "—" : `${acceptanceRate}%`}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 600 }}>Current Streak</p>
              <p style={{ margin: "0.2rem 0 0", fontSize: "1.4rem", fontWeight: 700, color: "var(--yellow)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Flame size={18} /> {currentStreak}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>Loading stats…</div>
        ) : (
          <>
            {/* Heatmap */}
            <Card title="Submission Activity" icon={<Flame size={15} />} style={{ marginBottom: "1.5rem", overflowX: "auto" }}>
              <div style={{ display: "inline-flex", gap: "3px", minWidth: "max-content" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginRight: "4px", paddingTop: "16px" }}>
                  {dayLabels.map((d, i) => (
                    <div key={d} style={{ height: 11, fontSize: "0.6rem", color: "var(--text-secondary)", lineHeight: "11px", visibility: i % 2 ? "visible" : "hidden" }}>
                      {d}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "3px" }}>
                  {weeks.map((week, wi) => {
                    const label = monthLabelForWeek(week);
                    return (
                      <div key={wi} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        <div style={{ height: 12, fontSize: "0.6rem", color: "var(--text-secondary)" }}>{label || ""}</div>
                        {week.map((day, di) => (
                          <div
                            key={di}
                            title={`${day.date}: ${day.count} submission${day.count === 1 ? "" : "s"}`}
                            style={{
                              width: 11,
                              height: 11,
                              borderRadius: 2,
                              background: day.inFuture ? "transparent" : levelColor(day.level),
                            }}
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.85rem", fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                Less
                {[0, 1, 2, 3, 4].map((l) => (
                  <div key={l} style={{ width: 11, height: 11, borderRadius: 2, background: levelColor(l) }} />
                ))}
                More
              </div>
            </Card>

            {/* Difficulty breakdown */}
            <Card title="Progress by Difficulty" icon={<Award size={15} />} style={{ marginBottom: "1.5rem" }}>
              {["easy", "medium", "hard"].map((d) => {
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
            </Card>

            {/* Row: Statistics + Language Usage */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }} className="profile-grid-2">
              <Card title="Statistics" icon={<BarChart3 size={15} />}>
                {statRows.length === 0 ? (
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: 0 }}>No submission data yet.</p>
                ) : (
                  statRows.map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderBottom: "1px solid var(--border)", fontSize: "0.85rem" }}>
                      <span style={{ color: "var(--text-secondary)" }}>{row.label}</span>
                      <span style={{ fontWeight: 700, color: row.color }}>{row.value}</span>
                    </div>
                  ))
                )}
              </Card>

              <Card title="Language Usage" icon={<Code2 size={15} />}>
                {languages.length === 0 ? (
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: 0 }}>No language data yet.</p>
                ) : (
                  languages.map((l) => (
                    <Bar key={l.language} label={l.language} pct={l.percentage} color="var(--accent-2)" />
                  ))
                )}
              </Card>
            </div>

            {/* Row: Topic Progress + Achievements */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }} className="profile-grid-2">
              <Card title="Topic Progress" icon={<BookOpen size={15} />}>
                {topics.length === 0 ? (
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: 0 }}>No topic data yet.</p>
                ) : (
                  topics.map((t) => (
                    <Bar key={t.topic} label={t.topic} pct={t.percentage} color="var(--green)" />
                  ))
                )}
              </Card>

              <Card title="Recent Achievements" icon={<Trophy size={15} />}>
                {achievements.length === 0 ? (
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: 0 }}>Keep solving to unlock badges.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {achievements.map((a, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.85rem" }}>
                        <span style={{ fontSize: "1.1rem" }}>{a.icon || "🏅"}</span>
                        <span>{a.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Mistake Notebook */}
            <Card title="Mistake Notebook" icon={<XCircle size={15} color="var(--red)" />} style={{ marginBottom: "1.5rem" }}>
              {mistakes.length === 0 ? (
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: 0 }}>No recurring mistakes logged. Nice work.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {mistakes.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "0.7rem 0",
                        borderBottom: i === mistakes.length - 1 ? "none" : "1px solid var(--border)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600 }}>
                        <span>{m.topic}</span>
                        <span style={{ color: "var(--text-secondary)", fontWeight: 400, fontSize: "0.75rem" }}>
                          {m.occurrences ? `Occurred ${m.occurrences} times` : m.lastOccurred}
                        </span>
                      </div>
                      <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", color: "var(--text-secondary)" }}>❌ {m.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Activity */}
            <Card title="Recent Activity" icon={<ActivityIcon size={15} />} style={{ marginBottom: "1.5rem" }}>
              {recent.length === 0 ? (
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: 0 }}>No recent submissions.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {recent.map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.85rem" }}>
                      {r.status === "Accepted" ? (
                        <CheckCircle size={15} color="var(--green)" />
                      ) : (
                        <XCircle size={15} color="var(--red)" />
                      )}
                      <span>{r.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Solved problems list */}
            <div>
              <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: "0 0 0.75rem" }}>Solved Problems</p>
              {solved.length === 0 ? (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "var(--text-secondary)",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                  }}
                >
                  No problems solved yet. <Link to="/" style={{ color: "var(--accent-2)" }}>Start solving →</Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {solved.map((p) => {
                    const diff = p.difficulty?.trim().toLowerCase();
                    const dc = diffMap[diff];
                    return (
                      <Link
                        key={p._id}
                        to={`/problem/${p._id}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: "var(--bg-card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          padding: "0.75rem 1rem",
                          textDecoration: "none",
                          color: "var(--text-primary)",
                          transition: "border-color 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#484f58")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
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

      <style>{`
        @media (max-width: 720px) {
          .profile-grid-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;