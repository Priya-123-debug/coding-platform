const axios = require("axios");
const mongoose = require("mongoose");
const Submission = require("../models/submission");
const problem = require("../models/problem");

// Builds the prompt the LLM will see.
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
Error / output: ${submission.errormessage || submission.errorMessage || "No error message available"}
Test cases passed: ${submission.testCasepassed ?? submission.testCasePassed ?? 0}/${submission.testCasetotal ?? submission.testCaseTotal ?? 0}

Explain the likely cause of failure and a hint to fix it. Keep it under 200 words.
`.trim();
};

// Isolated Groq API call
const callLLM = async (prompt) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in process.env");
  }

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

  return response.data?.choices?.[0]?.message?.content;
};

const explainFailure = async (req, res) => {
  try {
    const { submissionId } = req.params;

    // 1. Validate submissionId format to prevent Mongoose CastError
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({ message: "Invalid submission ID format" });
    }

    // 2. Safe retrieval of userId (supports both req.result and req.user auth patterns)
    const userId = req.result?._id || req.result?.id || req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user reference" });
    }

    // 3. Query submission
    const submission = await Submission.findOne({ _id: submissionId, userId });
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Return cached explanation if it already exists
    if (submission.aiExplanation) {
      return res.status(200).json({ explanation: submission.aiExplanation, cached: true });
    }

    // 4. Query problem document
    const problemDoc = await problem.findById(submission.problemId);
    if (!problemDoc) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // 5. Build prompt and call LLM
    const prompt = buildPrompt(submission, problemDoc);
    const explanation = await callLLM(prompt);

    if (!explanation) {
      throw new Error("Groq API returned an empty response");
    }

    // 6. Persist explanation
    submission.aiExplanation = explanation;
    await submission.save();

    return res.status(200).json({ explanation, cached: false });
  } catch (err) {
    // Detailed error logging to isolate exact failures in Node console
    console.error("❌ AI Explain Failure Details:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    });

    return res.status(500).json({
      message: "AI assistant failed to respond",
      error: err.response?.data?.error?.message || err.message,
    });
  }
};

module.exports = { explainFailure };