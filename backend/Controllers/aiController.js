const axios = require("axios");
const mongoose = require("mongoose");
const Submission = require("../models/submission");
const problem = require("../models/problem");

// Builds the prompt the LLM will see.
const buildPrompt = (submission, problemDoc) => {
  const title = problemDoc?.title || "Coding Problem";
  const difficulty = problemDoc?.difficulty || "N/A";
  const description = problemDoc?.description || "No description provided.";

  const code = submission?.code || "// No code provided";
  const language = submission?.language || "text";
  const status = submission?.status || "Failed";
  const errorMessage = submission?.errormessage || submission?.errorMessage || "No error message available";
  const passed = submission?.testCasepassed ?? submission?.testCasePassed ?? 0;
  const total = submission?.testCasetotal ?? submission?.testCaseTotal ?? 0;

  return `
You are a helpful coding tutor. A student submitted a solution that did not pass.
Explain in simple, encouraging language WHY it failed and give a hint toward the fix.
Do NOT just give the full corrected code — guide them, the way a mentor would.

Problem: ${title}
Difficulty: ${difficulty}
Description: ${description}

Student's code (${language}):
${code}

Judge verdict: ${status}
Error / output: ${errorMessage}
Test cases passed: ${passed}/${total}

Explain the likely cause of failure and a hint to fix it. Keep it under 200 words.
`.trim();
};

// Isolated Groq API call
const callLLM = async (prompt) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not defined in environment variables (.env file)");
  }

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      timeout: 15000, // 15-second timeout
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Received empty response content from Groq API");
  }

  return content;
};

const explainFailure = async (req, res) => {
  try {
    const { submissionId } = req.params;

    // 1. Validate submissionId format
    if (!submissionId || !mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({ message: "Invalid or missing submission ID parameter" });
    }

    // 2. Safely extract user ID across common middleware conventions
    const userId = req.result?._id || req.result?.id || req.user?._id || req.user?.id || req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Could not identify authenticated user" });
    }

    // 3. Find submission matching both ID and user
    const submission = await Submission.findOne({ _id: submissionId, userId });
    if (!submission) {
      return res.status(404).json({ message: "Submission not found for this user" });
    }

    // 4. Return cached explanation if present
    if (submission.aiExplanation) {
      return res.status(200).json({ explanation: submission.aiExplanation, cached: true });
    }

    // 5. Find associated problem document
    const problemDoc = await problem.findById(submission.problemId);
    if (!problemDoc) {
      return res.status(404).json({ message: "Associated problem document not found" });
    }

    // 6. Generate prompt and call Groq LLM
    const prompt = buildPrompt(submission, problemDoc);
    const explanation = await callLLM(prompt);

    // 7. Cache explanation to database
    submission.aiExplanation = explanation;
    await submission.save();

    return res.status(200).json({ explanation, cached: false });

  } catch (err) {
    const groqErrorMessage = err.response?.data?.error?.message;
    const generalErrorMessage = err.message;

    console.error("❌ AI Explain Route Error:", {
      status: err.response?.status,
      details: err.response?.data || generalErrorMessage,
    });

    return res.status(500).json({
      message: "AI assistant failed to respond",
      error: groqErrorMessage || generalErrorMessage,
    });
  }
};

module.exports = { explainFailure };