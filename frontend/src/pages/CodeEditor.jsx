import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../utilis/axiosClient";
import Editor from "@monaco-editor/react";

const CodeEditor = () => {
  const templates = {
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here
    return 0;
}`,
    python: `def solve():
    # Write your code here
    pass

if __name__ == "__main__":
    solve()`,
    javascript: `function solve() {
    // Write your code here
}

solve();`,
    java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}`,
  };

  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [selectedTestIndex, setSelectedTestIndex] = useState(0);

  // ✅ NEW STATES
  const [verdict, setVerdict] = useState("");
  const [testResult, setTestResult] = useState([]);

  // Reset selected tab when new results arrive
  useEffect(() => {
    setSelectedTestIndex(0);
  }, [testResult.length]);

  /* ---------------- Fetch Problem ---------------- */
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axiosClient.get(`/problem/problembyid/${id}`);
        setProblem(res.data);
      } catch (err) {
        console.error("Error fetching problem:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  /* ---------------- Get Start Code ---------------- */
  const getStartCodeForLanguage = (lang) => {
    if (!problem?.startcode?.length) return templates[lang];

    const codeObj = problem.startcode.find(
      (s) => s.language.toLowerCase() === lang.toLowerCase()
    );

    const rawCode = codeObj?.initialcode || templates[lang];
    return rawCode.replace(/\\n/g, "\n");
  };

  /* ---------------- Sync Code with Language ---------------- */
  useEffect(() => {
    if (problem) {
      setCode(getStartCodeForLanguage(language));
    }
  }, [problem, language]);

  /* ---------------- Run Code ---------------- */
  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      setOutput("Running...");
      setVerdict("");
      setTestResult([]);
      // console.log("Submitting code:", { language, code });

      const res = await axiosClient.post(`/submission/run/${id}`, {
        language,
        code,
      });

      console.log("Run Code Response:", res.data);

      // ✅ Merge backend results with displayInput from problem data
      const enrichedResults = res.data.results.map((result, index) => {
        const originalTestCase = problem.visibleTestCases?.[index];
        return {
          ...result,
          displayInput: originalTestCase?.displayInput || result.displayInput,
        };
      });

      setVerdict(res.data.verdict);
      setTestResult(enrichedResults);
      setOutput(res.data.verdict);
    } catch (err) {
      console.error(err);
      setOutput(err.response?.data || "Error running code");
    } finally {
      setIsRunning(false);
    }
  };

  /* ---------------- Submit Code ---------------- */
  const handleSubmitCode = async () => {
    try {
      setIsSubmitting(true);
      setOutput("Submitting...");
      setVerdict("");
      setTestResult([]);
      console.log("1. Submit button clicked")
       console.log("3. Sending request to backend...");
      const res = await axiosClient.post(`/submission/submit/${id}`, {
        language,
        code,
      });
      console.log("4. Response received:", res.data);

      const submission = res.data;
      const status = submission.status || "Submitted";
      const passed = submission.testCasepassed ?? 0;
      const total = submission.testCasetotal ?? 0;
      const message =
        status === "Accepted"
          ? `Accepted (${passed}/${total} hidden tests passed)`
          : submission.errormessage || status;

      setVerdict(status);
      setOutput(message);
    } catch (err) {
      console.error(err);
      setVerdict("Not Accepted");
      setOutput(err.response?.data || "Error submitting code");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------- Render Guards ---------------- */
  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  if (!problem) {
    return <div className="text-red-500 p-6">Problem not found</div>;
  }

  // console.log("Problem Data:", problem);

  /* ---------------- UI ---------------- */
  return (
    <div className="grid grid-cols-12 h-screen overflow-hidden min-h-0">
      {/* Left Panel */}
      <div className="col-span-4 bg-gray-800 p-4 overflow-y-auto h-screen min-h-0">
        <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>
        <p className="text-sm text-yellow-400 mb-4">
          Difficulty: {problem.difficulty}
        </p>
        <p className="text-gray-300 whitespace-pre-line mb-4">{problem.description}</p>

        <h3 className="text-lg font-semibold mb-2">Example Test Cases</h3>
        <ul className="space-y-2">
          {problem.visibleTestCases.map((test, i) => (
            <li key={i} className="bg-gray-700 p-2 rounded text-sm">
              <p>
                <b>Input:</b> {test.displayInput || test.input}
              </p>
              <p>
                <b>Output:</b> {test.output}
              </p>
              {test.explanation && (
                <p>
                  <b>Explanation:</b> {test.explanation}
                </p>
              )}
            </li>
          ))}
        </ul>


        {/* Tags Accordion */}
        <div className="my-4">
          <button
            type="button"
            onClick={() => setIsTagsOpen((prev) => !prev)}
            className="w-full flex items-center justify-between bg-gray-700 px-3 py-2 rounded"
          >
            <span className="font-semibold">Tags ({problem.tags?.length || 0})</span>
            <span>{isTagsOpen ? "▲" : "▼"}</span>
          </button>

          {isTagsOpen && (
            <div className="mt-2 flex flex-wrap gap-2">
              {(problem.tags && problem.tags.length > 0
                ? problem.tags
                : ["No tags"]
              ).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-600 rounded text-sm text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="col-span-8 bg-gray-800 flex flex-col h-screen min-h-0">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-2 border-b border-gray-700">
          <select
            className="bg-gray-600 text-white p-2 rounded"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>

          <div>
            <button
              onClick={handleRunCode}
              disabled={isRunning || isSubmitting}
              className={`bg-gray-700 px-4 py-2 rounded mr-3 ${
                isRunning || isSubmitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              Run
            </button>
            <button
              onClick={handleSubmitCode}
              disabled={isRunning || isSubmitting}
              className={`bg-yellow-500 px-4 py-2 rounded text-black ${
                isRunning || isSubmitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Verdict */}
        {verdict && (
          <div
            className={`p-2 text-center font-bold ${verdict === "Accepted"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
              }`}
          >
            {verdict}
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 min-h-0">
          <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
            }}
          />
        </div>

        {/* Output + Testcase Results (LeetCode-like with tabs) */}
        <div className="max-h-80 bg-[#0b0b0f] text-white border-t border-gray-700 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="text-gray-200">Output</span>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  isRunning || isSubmitting
                    ? "bg-yellow-500/20 text-yellow-300"
                    : verdict === "Accepted"
                      ? "bg-green-500/20 text-green-300"
                      : verdict
                        ? "bg-red-500/20 text-red-300"
                        : "bg-gray-600 text-gray-200"
                }`}
              >
                {isRunning
                  ? "Running"
                  : isSubmitting
                    ? "Submitting"
                    : verdict || "Ready"}
              </span>
            </div>
            <div className="text-xs text-gray-400">Console</div>
          </div>

          {/* Tabs for testcases */}
          <div className="px-3 py-2 border-b border-gray-800 overflow-x-auto">
            <div className="flex gap-2 text-xs">
              {(testResult.length ? testResult : problem.visibleTestCases || []).map((t, i) => {
                const status = t.status;
                const active = i === selectedTestIndex;
                const statusClass = status === "Accepted"
                  ? "text-green-300 border-green-500/60"
                  : status
                    ? "text-red-300 border-red-500/60"
                    : "text-gray-300 border-gray-600";
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedTestIndex(i)}
                    className={`px-3 py-1 rounded border bg-gray-900/60 hover:bg-gray-800/80 ${statusClass} ${active ? "ring-1 ring-blue-500" : ""
                      }`}
                  >
                    {`Case ${i + 1}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-auto max-h-72 space-y-3 px-3 py-2 flex-1 min-h-0">
            {/* Selected testcase details */}
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Testcase</div>
              {(() => {
                const list = testResult.length ? testResult : problem.visibleTestCases || [];
                if (!list.length) return <div className="text-xs text-gray-500">No testcases</div>;
                const t = list[Math.min(selectedTestIndex, list.length - 1)];
                const status = t.status;
                return (
                  <div className="border border-gray-700 rounded p-2 bg-gray-900/50 space-y-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-200">Testcase {t.testcase ?? (selectedTestIndex + 1)}</span>
                      <span
                        className={
                          status === "Accepted"
                            ? "text-green-400"
                            : status
                              ? "text-red-400"
                              : "text-gray-400"
                        }
                      >
                        {status || "Not run"}
                      </span>
                    </div>

                    {/* {t.input && (
                      <div>
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap">Actual Input: {t.input}</pre>
                      </div>
                    )} */}
                    {t.displayInput && (
                      <pre className="text-xs text-green-300 whitespace-pre-wrap font-semibold">Input: {t.displayInput}</pre>
                    )}
                    {(t.expected_output || t.output) && (
                      <div className="space-y-1">
                        {t.expected_output && (
                          <pre className="text-xs text-gray-400 whitespace-pre-wrap">Expected: {t.expected_output}</pre>
                        )}
                        {t.output && (
                          <pre className="text-xs text-green-300 whitespace-pre-wrap">Output: {t.output}</pre>
                        )}
                      </div>
                    )}
                    {t.error && (
                      <pre className="text-xs text-red-400 whitespace-pre-wrap">Error: {t.error}</pre>
                    )}
                    {t.explanation && (
                      <pre className="text-xs text-gray-400 whitespace-pre-wrap">Explanation: {t.explanation}</pre>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
