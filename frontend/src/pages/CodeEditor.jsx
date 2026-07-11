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

// ── MyNote component ───────────────────────────────────────────────
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

      <Link to="/notebook" style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-secondary)", fontSize: "0.75rem", textDecoration: "none" }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--accent-2)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
      >
        <NotebookPen size={12} /> View all notes in Learning Notebook →
      </Link>

      {!savedNote && !note && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "0.8rem", fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          💡 Best time to write is right after solving — the lesson is freshest then.
        </div>
      )}
    </div>
  );
};

// ── Main CodeEditor ────────────────────────────────────────────────
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
  const [leftWidth] = useState(40);
  const [leftTab, setLeftTab] = useState("description");

  useEffect(() => { setSelectedTestIndex(0); }, [testResult.length]);

  useEffect(() => {
    axiosClient.get(`/problem/problembyid/${id}`)
      .then(res => setProblem(res.data))
      .catch(console.error)
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
        ...r,
        yourOutput: r.output,
        expectedOutput: r.expected_output,
        displayInput: problem.visibleTestCases?.[i]?.displayInput || r.input,
        output: undefined,
        expected_output: undefined,
      }));
      setVerdict(res.data.verdict);
      setTestResult(enriched);
      setOutputMsg(res.data.verdict);
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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", minWidth: 0 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.82rem", flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
          >
            <ArrowLeft size={14} /> Problems
          </Link>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ fontWeight: 600, fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{problem.title}</span>
          <span style={{ color: diffColor, fontSize: "0.75rem", fontWeight: 600, flexShrink: 0 }}>{problem.difficulty}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
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
            fontSize: "0.8rem", fontWeight: 600, cursor: isRunning || isSubmitting ? "not-allowed" : "pointer",
            opacity: (isRunning || isSubmitting) ? 0.5 : 1,
          }}>
            <Play size={13} /> {isRunning ? "Running…" : "Run"}
          </button>

          <button onClick={handleSubmitCode} disabled={isRunning || isSubmitting} style={{
            display: "flex", alignItems: "center", gap: "0.35rem",
            background: "var(--green)", border: "none",
            color: "#fff", borderRadius: "6px", padding: "0.35rem 0.85rem",
            fontSize: "0.8rem", fontWeight: 600, cursor: isRunning || isSubmitting ? "not-allowed" : "pointer",
            opacity: (isRunning || isSubmitting) ? 0.5 : 1,
          }}>
            <Upload size={13} /> {isSubmitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </div>

      {/* MAIN SPLIT */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        {/* LEFT PANEL */}
        <div style={{
          width: `${leftWidth}%`, flexShrink: 0, overflow: "hidden",
          display: "flex", flexDirection: "column", borderRight: "1px solid var(--border)",
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0, background: "var(--bg-secondary)" }}>
            {[
              { key: "description", label: "Description" },
              { key: "discussion",  label: "Discussion"  },
              { key: "mynote",      label: "My Note"     },
            ].map(tab => (
              <button key={tab.key} onClick={() => setLeftTab(tab.key)} style={{
                flex: 1, background: "none", border: "none",
                borderBottom: leftTab === tab.key ? "2px solid var(--accent)" : "2px solid transparent",
                color: leftTab === tab.key ? "var(--text-primary)" : "var(--text-secondary)",
                padding: "0.65rem 0.4rem", fontSize: "0.78rem", fontWeight: 600,
                cursor: "pointer", whiteSpace: "nowrap", transition: "color 0.15s",
              }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Description */}
          {leftTab === "description" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>{problem.title}</h2>
              <p style={{ color: diffColor, fontSize: "0.78rem", fontWeight: 600, marginBottom: "1rem" }}>{problem.difficulty}</p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, fontSize: "0.88rem", whiteSpace: "pre-line", marginBottom: "1.5rem" }}>{problem.description}</p>

              <h3 style={{ fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Examples</h3>
              {problem.visibleTestCases?.map((tc, i) => (
                <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "0.85rem", marginBottom: "0.75rem" }}>
                  <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Example {i + 1}</p>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <div><span style={{ color: "var(--text-secondary)" }}>Input: </span><span style={{ color: "var(--accent-2)" }}>{tc.displayInput || tc.input}</span></div>
                    <div><span style={{ color: "var(--text-secondary)" }}>Output: </span><span style={{ color: "var(--green)" }}>{tc.output}</span></div>
                    {tc.explanation && <div style={{ marginTop: "0.25rem", color: "var(--text-secondary)", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontStyle: "italic" }}>{tc.explanation}</div>}
                  </div>
                </div>
              ))}

              {problem.tags?.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                  <button onClick={() => setIsTagsOpen(p => !p)} style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px",
                    padding: "0.6rem 0.85rem", cursor: "pointer", color: "var(--text-primary)", fontSize: "0.82rem", fontWeight: 600,
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

          {leftTab === "discussion" && <Discussion problemId={id} />}
          {leftTab === "mynote"     && <MyNote problemId={id} />}
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

          {/* Verdict banner */}
          {verdict && (
            <div style={{
              padding: "0.5rem 1rem", textAlign: "center", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0,
              background: verdict === "Accepted" ? "rgba(63,185,80,0.12)" : "rgba(248,81,73,0.12)",
              color: verdict === "Accepted" ? "var(--green)" : "var(--red)",
              borderBottom: `1px solid ${verdict === "Accepted" ? "rgba(63,185,80,0.3)" : "rgba(248,81,73,0.3)"}`,
            }}>
              {outputMsg || verdict}
            </div>
          )}

          {/* Monaco editor */}
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

          {/* OUTPUT PANEL */}
          <div style={{ height: "260px", borderTop: "1px solid var(--border)", background: "#0d1117", display: "flex", flexDirection: "column", flexShrink: 0 }}>

            {/* Tab bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0.75rem", borderBottom: "1px solid var(--border)", height: "38px", flexShrink: 0 }}>
              <div style={{ display: "flex", gap: "0.35rem", overflowX: "auto" }}>
                {!testResult.length
                  ? problem.visibleTestCases?.map((_, i) => (
                      <button key={i} onClick={() => setSelectedTestIndex(i)} style={{
                        background: selectedTestIndex === i ? "var(--bg-card)" : "transparent",
                        border: selectedTestIndex === i ? "1px solid var(--border)" : "1px solid transparent",
                        borderRadius: "6px", padding: "0.25rem 0.65rem", fontSize: "0.75rem",
                        color: "var(--text-secondary)", cursor: "pointer",
                        fontWeight: selectedTestIndex === i ? 600 : 400,
                      }}>
                        Case {i + 1}
                      </button>
                    ))
                  : testResult.map((t, i) => {
                      const isPassed = t.status === "Accepted";
                      return (
                        <button key={i} onClick={() => setSelectedTestIndex(i)} style={{
                          background: selectedTestIndex === i ? "var(--bg-card)" : "transparent",
                          border: selectedTestIndex === i ? "1px solid var(--border)" : "1px solid transparent",
                          borderRadius: "6px", padding: "0.25rem 0.65rem", fontSize: "0.75rem",
                          color: isPassed ? "var(--green)" : "var(--red)",
                          cursor: "pointer", fontWeight: selectedTestIndex === i ? 600 : 400,
                        }}>
                          {isPassed ? "✓" : "✗"} Case {i + 1}
                        </button>
                      );
                    })
                }
              </div>

              {/* Pass count summary */}
              {testResult.length > 0 && (
                <span style={{
                  fontSize: "0.72rem", fontWeight: 700, flexShrink: 0, marginLeft: "0.5rem",
                  color: testResult.every(t => t.status === "Accepted") ? "var(--green)" : "var(--red)",
                }}>
                  {testResult.filter(t => t.status === "Accepted").length}/{testResult.length} passed
                </span>
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0.85rem 1rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem" }}>

              {/* Before running */}
              {!testResult.length ? (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
                  <Play size={22} color="var(--text-secondary)" opacity={0.35} />
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                    Click <strong style={{ color: "var(--text-primary)" }}>Run</strong> to test against sample cases
                  </span>
                </div>
              ) : (() => {
                const t = testResult[Math.min(selectedTestIndex, testResult.length - 1)];
                const isPassed = t.status === "Accepted";
                const hasFailed = t.status && !isPassed;
                const cleanOutput   = t.yourOutput?.replace(/\n$/, "") ?? null;
                const cleanExpected = t.expectedOutput?.replace(/\n$/, "") ?? null;
                const inputToShow   = t.displayInput || t.input || null;

                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

                    {/* Status badge */}
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: "0.4rem",
                      background: isPassed ? "rgba(63,185,80,0.12)" : "rgba(248,81,73,0.12)",
                      color: isPassed ? "var(--green)" : "var(--red)",
                      border: `1px solid ${isPassed ? "rgba(63,185,80,0.3)" : "rgba(248,81,73,0.3)"}`,
                      borderRadius: "20px", padding: "0.2rem 0.75rem",
                      fontSize: "0.72rem", fontWeight: 700, width: "fit-content",
                    }}>
                      {isPassed ? "✓ Accepted" : `✗ ${t.status}`}
                    </div>

                    {/* Input */}
                    {inputToShow && (
                      <div>
                        <div style={{ color: "var(--text-secondary)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Input</div>
                        <div style={{ background: "var(--bg-secondary)", borderRadius: "6px", padding: "0.5rem 0.75rem", color: "var(--accent-2)", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                          {inputToShow}
                        </div>
                      </div>
                    )}

                    {/* Expected output */}
                    {cleanExpected !== null && (
                      <div>
                        <div style={{ color: "var(--text-secondary)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Expected Output</div>
                        <div style={{ background: "var(--bg-secondary)", borderRadius: "6px", padding: "0.5rem 0.75rem", color: "var(--text-primary)", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                          {cleanExpected}
                        </div>
                      </div>
                    )}

                    {/* Your output */}
                    <div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Your Output</div>
                      <div style={{
                        background: "var(--bg-secondary)", borderRadius: "6px", padding: "0.5rem 0.75rem",
                        color: isPassed ? "var(--green)" : hasFailed ? "var(--red)" : "var(--text-primary)",
                        border: `1px solid ${isPassed ? "rgba(63,185,80,0.25)" : hasFailed ? "rgba(248,81,73,0.25)" : "transparent"}`,
                        whiteSpace: "pre-wrap", wordBreak: "break-all", minHeight: "2rem",
                      }}>
                        {cleanOutput ?? <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>no output</span>}
                      </div>
                    </div>

                    {/* Error */}
                    {t.error && (
                      <div>
                        <div style={{ color: "var(--red)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Error</div>
                        <div style={{ background: "rgba(248,81,73,0.08)", border: "1px solid rgba(248,81,73,0.2)", borderRadius: "6px", padding: "0.5rem 0.75rem", color: "var(--red)", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                          {t.error}
                        </div>
                      </div>
                    )}
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