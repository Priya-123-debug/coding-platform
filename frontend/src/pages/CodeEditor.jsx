import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../utilis/axiosClient";
import Editor from "@monaco-editor/react";
import { Play, Upload, ChevronDown, ChevronUp, ArrowLeft, NotebookPen, CheckCircle2, Trash2 } from "lucide-react";
import Navbar from "./Navbar";
import Discussion from "./Discussion";


const templates = {
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}`,
  python: `def solve():\n    # Write your code here\n    pass\n\nif __name__ == "__main__":\n    solve()`,
  javascript: `function solve() {\n    // Write your code here\n}\n\nsolve();`,
  java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}`,
};

// ── My Note tab component ──────────────────────────────────────────
const MyNote = ({ problemId }) => {
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    axiosClient.get(`/mistake/${problemId}`)
      .then(({ data }) => {
        if (data) { setNote(data.note); setSavedNote(data); }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [problemId]);

  const handleSave = async () => {
    if (!note.trim()) return;
    try {
      setSaving(true);
      if (savedNote) {
        const { data } = await axiosClient.put(`/mistake/${savedNote._id}`, { note });
        setSavedNote(data);
      } else {
        const { data } = await axiosClient.post("/mistake", { problemId, note });
        setSavedNote(data.mistake);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this note?")) return;
    try {
      setDeleting(true);
      await axiosClient.delete(`/mistake/${savedNote._id}`);
      setSavedNote(null);
      setNote("");
    } catch (err) { console.error(err); }
    finally { setDeleting(false); }
  };

  if (loading) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
      Loading…
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <NotebookPen size={15} color="var(--accent)" />
        <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>My Note</span>
        {savedNote && (
          <span style={{ marginLeft: "auto", background: "rgba(63,185,80,0.12)", color: "var(--green)", border: "1px solid rgba(63,185,80,0.3)", borderRadius: "20px", padding: "0.1rem 0.55rem", fontSize: "0.68rem", fontWeight: 700 }}>
            ✓ Saved
          </span>
        )}
      </div>

      <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem", margin: 0, lineHeight: 1.5 }}>
        What did you learn? Write down mistakes, tricks, or approaches to remember.
      </p>

      {/* Textarea */}
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="e.g. Forgot to handle empty array edge case. Key insight was using two pointers instead of nested loops..."
        style={{
          flex: 1, minHeight: "200px",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderLeft: "3px solid var(--accent)",
          borderRadius: "8px", padding: "0.85rem",
          color: "var(--text-primary)", fontSize: "0.84rem",
          lineHeight: 1.7, resize: "vertical", outline: "none",
          fontFamily: "'Inter', sans-serif",
        }}
        onFocus={e => e.target.style.borderColor = "var(--accent-2)"}
        onBlur={e => e.target.style.borderColor = "var(--border)"}
      />

      {/* Character count + buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.7rem", color: note.length > 2800 ? "var(--red)" : "var(--text-secondary)" }}>
          {note.length} / 3000
        </span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {savedNote && (
            <button onClick={handleDelete} disabled={deleting} style={{
              display: "flex", alignItems: "center", gap: "0.3rem",
              background: "rgba(248,81,73,0.1)", color: "var(--red)",
              border: "1px solid rgba(248,81,73,0.25)", borderRadius: "7px",
              padding: "0.4rem 0.8rem", fontSize: "0.78rem", fontWeight: 600,
              cursor: deleting ? "not-allowed" : "pointer",
            }}>
              <Trash2 size={12} /> {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
          <button onClick={handleSave} disabled={saving || !note.trim() || note.length > 3000} style={{
            display: "flex", alignItems: "center", gap: "0.3rem",
            background: saved ? "rgba(63,185,80,0.15)" : "var(--accent)",
            color: saved ? "var(--green)" : "#fff",
            border: saved ? "1px solid rgba(63,185,80,0.3)" : "none",
            borderRadius: "7px", padding: "0.4rem 0.9rem",
            fontSize: "0.78rem", fontWeight: 600,
            cursor: (saving || !note.trim()) ? "not-allowed" : "pointer",
            opacity: (saving || !note.trim()) ? 0.6 : 1,
            transition: "all 0.2s",
          }}>
            {saved ? <><CheckCircle2 size={12} /> Saved!</> : saving ? "Saving…" : savedNote ? "Update" : "Save Note"}
          </button>
        </div>
      </div>

      {/* Link to full notebook */}
      <Link to="/notebook" style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-secondary)", fontSize: "0.75rem", textDecoration: "none", marginTop: "0.25rem" }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--accent-2)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
      >
        <NotebookPen size={12} /> View all notes in Learning Notebook →
      </Link>

      {/* Tip when empty */}
      {!savedNote && !note && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "0.8rem", fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          💡 Best time to write is right after solving — the lesson is freshest then.
        </div>
      )}
    </div>
  );
};

// ── Main CodeEditor component ──────────────────────────────────────
const CodeEditor = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [selectedTestIndex, setSelectedTestIndex] = useState(0);
  const [verdict, setVerdict] = useState("");
  const [testResult, setTestResult] = useState([]);
  const [outputMsg, setOutputMsg] = useState("");
  const [leftWidth, setLeftWidth] = useState(40);
  const [leftTab, setLeftTab] = useState("description");

  useEffect(() => { setSelectedTestIndex(0); }, [testResult.length]);

  useEffect(() => {
    axiosClient.get(`/problem/problembyid/${id}`)
      .then(res => setProblem(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const getStartCode = (lang) => {
    if (!problem?.startcode?.length) return templates[lang];
    const obj = problem.startcode.find(s => s.language.toLowerCase() === lang.toLowerCase());
    return (obj?.initialcode || templates[lang]).replace(/\\n/g, "\n");
  };

  useEffect(() => { if (problem) setCode(getStartCode(language)); }, [problem, language]);

  const handleRunCode = async () => {
    try {
      setIsRunning(true); setVerdict(""); setTestResult([]); setOutputMsg("Running…");
      const res = await axiosClient.post(`/submission/run/${id}`, { language, code });
      const enriched = res.data.results.map((r, i) => ({
        ...r, displayInput: problem.visibleTestCases?.[i]?.displayInput || r.displayInput,
      }));
      setVerdict(res.data.verdict); setTestResult(enriched); setOutputMsg(res.data.verdict);
    } catch (err) { setOutputMsg(err.response?.data || "Error running code"); }
    finally { setIsRunning(false); }
  };

  const handleSubmitCode = async () => {
    try {
      setIsSubmitting(true); setVerdict(""); setTestResult([]); setOutputMsg("Submitting…");
      const res = await axiosClient.post(`/submission/submit/${id}`, { language, code });
      const sub = res.data;
      const status = sub.status || "Submitted";
      const msg = status === "Accepted"
        ? `Accepted — ${sub.testCasepassed ?? 0}/${sub.testCasetotal ?? 0} hidden tests passed`
        : sub.errormessage || status;
      setVerdict(status); setOutputMsg(msg);
    } catch (err) { setVerdict("Error"); setOutputMsg(err.response?.data || "Error submitting"); }
    finally { setIsSubmitting(false); }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
      Loading problem…
    </div>
  );
  if (!problem) return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--red)" }}>
      Problem not found.
    </div>
  );

  const diffColor = { easy: "var(--green)", medium: "var(--yellow)", hard: "var(--red)" }[problem.difficulty?.toLowerCase()] || "var(--text-secondary)";
  const testList = testResult.length ? testResult : (problem.visibleTestCases || []);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)", fontFamily: "'Inter', sans-serif", overflow: "hidden" }}>

      {/* GLOBAL NAVBAR */}
      <div style={{ flexShrink: 0 }}>
        <Navbar />
      </div>

      {/* TOP BAR */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)",
        padding: "0 1rem", height: "48px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.82rem" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
          >
            <ArrowLeft size={14} /> Problems
          </Link>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{problem.title}</span>
          <span style={{ color: diffColor, fontSize: "0.75rem", fontWeight: 600 }}>{problem.difficulty}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <select value={language} onChange={e => setLanguage(e.target.value)} style={{
            background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)",
            borderRadius: "6px", padding: "0.35rem 0.65rem", fontSize: "0.8rem", cursor: "pointer", outline: "none",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>

          <button onClick={handleRunCode} disabled={isRunning || isSubmitting} style={{
            display: "flex", alignItems: "center", gap: "0.35rem",
            background: "var(--bg-card)", border: "1px solid var(--border)",
            color: "var(--text-primary)", borderRadius: "6px", padding: "0.35rem 0.85rem",
            fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
            opacity: (isRunning || isSubmitting) ? 0.5 : 1,
          }}>
            <Play size={13} /> Run
          </button>

          <button onClick={handleSubmitCode} disabled={isRunning || isSubmitting} style={{
            display: "flex", alignItems: "center", gap: "0.35rem",
            background: "var(--green)", border: "none",
            color: "#fff", borderRadius: "6px", padding: "0.35rem 0.85rem",
            fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
            opacity: (isRunning || isSubmitting) ? 0.5 : 1,
          }}>
            <Upload size={13} /> Submit
          </button>
        </div>
      </div>

      {/* MAIN SPLIT PANEL */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        {/* LEFT */}
        <div style={{
          width: `${leftWidth}%`, flexShrink: 0, overflow: "hidden",
          display: "flex", flexDirection: "column", borderRight: "1px solid var(--border)",
        }}>

          {/* Tab bar: 3 tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            {[
              { key: "description", label: "Description" },
              { key: "discussion",  label: "Discussion" },
              { key: "mynote",      label: "My Note" },
            ].map(tab => (
              <button key={tab.key} onClick={() => setLeftTab(tab.key)} style={{
                flex: 1, background: "none", border: "none",
                borderBottom: leftTab === tab.key ? "2px solid var(--accent)" : "2px solid transparent",
                color: leftTab === tab.key ? "var(--text-primary)" : "var(--text-secondary)",
                padding: "0.65rem 0.4rem", fontSize: "0.78rem", fontWeight: 600,
                cursor: "pointer", whiteSpace: "nowrap",
              }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Description */}
          {leftTab === "description" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.25rem" }}>{problem.title}</h2>
              <p style={{ color: diffColor, fontSize: "0.78rem", fontWeight: 600, marginBottom: "1rem" }}>{problem.difficulty}</p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.88rem", whiteSpace: "pre-line", marginBottom: "1.5rem" }}>{problem.description}</p>

              <h3 style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Examples</h3>
              {problem.visibleTestCases?.map((tc, i) => (
                <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "0.85rem", marginBottom: "0.75rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}>
                  <p style={{ color: "var(--text-secondary)", marginBottom: "0.3rem", fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 600 }}>EXAMPLE {i + 1}</p>
                  <div style={{ color: "var(--text-secondary)" }}><span style={{ color: "var(--accent-2)" }}>Input</span>   {tc.displayInput || tc.input}</div>
                  <div style={{ marginTop: "0.3rem", color: "var(--text-secondary)" }}><span style={{ color: "var(--green)" }}>Output</span>  {tc.output}</div>
                  {tc.explanation && <div style={{ marginTop: "0.4rem", color: "var(--text-secondary)", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontStyle: "italic" }}>{tc.explanation}</div>}
                </div>
              ))}

              {problem.tags?.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                  <button onClick={() => setIsTagsOpen(p => !p)} style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px",
                    padding: "0.65rem 0.9rem", cursor: "pointer", color: "var(--text-primary)", fontSize: "0.82rem", fontWeight: 600,
                  }}>
                    <span>Topics ({problem.tags.length})</span>
                    {isTagsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {isTagsOpen && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", padding: "0.75rem 0.25rem 0" }}>
                      {problem.tags.map((tag, i) => (
                        <span key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "20px", padding: "0.2rem 0.65rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Discussion */}
          {leftTab === "discussion" && <Discussion problemId={id} />}

          {/* My Note */}
          {leftTab === "mynote" && <MyNote problemId={id} />}

        </div>

        {/* RIGHT – editor + output */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

          {verdict && (
            <div style={{
              padding: "0.5rem 1rem", textAlign: "center", fontWeight: 700, fontSize: "0.85rem",
              background: verdict === "Accepted" ? "rgba(63,185,80,0.12)" : "rgba(248,81,73,0.12)",
              color: verdict === "Accepted" ? "var(--green)" : "var(--red)",
              borderBottom: `1px solid ${verdict === "Accepted" ? "rgba(63,185,80,0.3)" : "rgba(248,81,73,0.3)"}`,
              flexShrink: 0,
            }}>
              {outputMsg || verdict}
            </div>
          )}

          <div style={{ flex: 1, minHeight: 0 }}>
            <Editor
              height="100%"
              theme="vs-dark"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              onChange={v => setCode(v || "")}
              options={{ fontSize: 13, minimap: { enabled: false }, automaticLayout: true, scrollBeyondLastLine: false, padding: { top: 12 } }}
            />
          </div>

          <div style={{ height: "220px", borderTop: "1px solid var(--border)", background: "#0d1117", display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0.75rem", borderBottom: "1px solid var(--border)", height: "36px", flexShrink: 0 }}>
              <div style={{ display: "flex", gap: "0.4rem", overflowX: "auto" }}>
                {testList.map((t, i) => {
                  const isActive = i === selectedTestIndex;
                  const st = t.status;
                  const color = st === "Accepted" ? "var(--green)" : st ? "var(--red)" : "var(--text-secondary)";
                  return (
                    <button key={i} onClick={() => setSelectedTestIndex(i)} style={{
                      background: isActive ? "var(--bg-card)" : "transparent",
                      border: isActive ? "1px solid var(--border)" : "1px solid transparent",
                      borderRadius: "6px", padding: "0.25rem 0.65rem", fontSize: "0.75rem",
                      color, cursor: "pointer", fontWeight: isActive ? 600 : 400, whiteSpace: "nowrap",
                    }}>
                      Case {i + 1} {st === "Accepted" ? "✓" : st ? "✗" : ""}
                    </button>
                  );
                })}
              </div>
              <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Console</span>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem" }}>
              {(() => {
                if (!testList.length) return <span style={{ color: "var(--text-secondary)" }}>Run your code to see results.</span>;
                const t = testList[Math.min(selectedTestIndex, testList.length - 1)];
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {t.displayInput && <div><span style={{ color: "var(--text-secondary)" }}>Input: </span><span style={{ color: "var(--accent-2)" }}>{t.displayInput}</span></div>}
                    {t.expected_output && <div><span style={{ color: "var(--text-secondary)" }}>Expected: </span><span style={{ color: "var(--text-primary)" }}>{t.expected_output}</span></div>}
                    {t.output && <div><span style={{ color: "var(--text-secondary)" }}>Output: </span><span style={{ color: t.status === "Accepted" ? "var(--green)" : "var(--red)" }}>{t.output}</span></div>}
                    {t.error && <div><span style={{ color: "var(--text-secondary)" }}>Error: </span><span style={{ color: "var(--red)" }}>{t.error}</span></div>}
                    {t.explanation && <div style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>{t.explanation}</div>}
                    {!t.displayInput && !t.output && !t.error && <span style={{ color: "var(--text-secondary)" }}>No output yet.</span>}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          [data-split] { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
};

export default CodeEditor;