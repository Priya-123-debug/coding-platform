const axios = require("axios");
const Submission = require("../models/submission");
const problem = require("../models/problem");

// Builds the prompt the LLM will see. Keeping this as its own function
// makes it easy to tweak wording later without touching request logic.
const buildPrompt = (submission, problemDoc) => {
  return `
You are a helpful coding tutor. A student submitted a solution that did not pass.
Explain in simple, encouraging language WHY it failed and give a hint toward the fix.
Do NOT just give the full corrected code — guide them, the way a mentor would.

Problem: ${problemDoc.title}
Difficulty: ${problemDoc.difficulty}
Description: ${problemDoc.description}

Student's code (${submission.language}):
${submission.code}

Judge verdict: ${submission.status}
Error / output: ${submission.errormessage || "No error message available"}
Test cases passed: ${submission.testCasepassed}/${submission.testCasetotal}

Explain the likely cause of failure and a hint to fix it. Keep it under 200 words.
`.trim();
};

// Isolated Groq API call using OpenAI-compatible HTTP endpoint
const callLLM = async (prompt) => {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.choices[0].message.content;
};

const explainFailure = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.result._id;

    const submission = await Submission.findOne({ _id: submissionId, userId });
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // If we already generated an explanation for this submission, don't
    // pay for another LLM call — just return the saved one.
    if (submission.aiExplanation) {
      return res.status(200).json({ explanation: submission.aiExplanation, cached: true });
    }

    const problemDoc = await problem.findById(submission.problemId);
    if (!problemDoc) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const prompt = buildPrompt(submission, problemDoc);
    const explanation = await callLLM(prompt);

    submission.aiExplanation = explanation;
    await submission.save();

    res.status(200).json({ explanation, cached: false });
  } catch (err) {
    console.error("❌ AI Explain Error:", err.response?.data || err.message);
    res.status(500).json({ message: "AI assistant failed to respond" });
  }
};

module.exports = { explainFailure };