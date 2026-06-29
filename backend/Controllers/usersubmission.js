const problem = require("../models/problem");
const Submission = require("../models/submission");
const {
  getLanguageId,
  submitBatch,
  submitToken,
} = require("../utilis/Problemutility");

const submitcode = async (req, res) => {
  try {
    const userid = req.result._id;
    const problemid = req.params.id;
    const { code, language } = req.body;

    if (!userid || !problemid || !code || !language) {
      return res.status(400).send("Missing required fields");
    }

    const problemindatabase = await problem.findById(problemid);
    if (!problemindatabase) {
      return res.status(404).send("Problem not found");
    }

    const submission = await Submission.create({
      userId: userid,
      problemId: problemid,
      code,
      language,
      status: "pending",
      testCasetotal: problemindatabase.hiddenTestCases.length,
    });

    const languageid = getLanguageId(language);

    const encode = (str) => Buffer.from(str || "", "utf-8").toString("base64");

    const getFullSourceCode = () => {
      const lang = String(language || "").toLowerCase();
      const driver =
        problemindatabase.drivercode?.find(
          (d) => String(d.language || "").toLowerCase() === lang
        ) || null;

      if (driver && (driver.importcode || driver.maincode)) {
        const top = driver.importcode || "";
        const bottom = driver.maincode || "";
        return `${top}\n${code}\n${bottom}`.trim();
      }

      // Fallback for legacy single-block driver
      if (driver?.initialcode) {
        return `${code}\n${driver.initialcode}`;
      }

      return code;
    };

    const fullSource = getFullSourceCode();

    const submissions = problemindatabase.hiddenTestCases.map((testcase) => ({
      source_code: encode(fullSource),
      language_id: languageid,
      stdin: encode(testcase.input),
      expected_output: encode(testcase.output),
    }));

    const submitresult = await submitBatch(submissions, true);
    const tokens = submitresult.map((r) => r.token);
    const results = await submitToken(tokens);

    let passed = 0;
    let status = "Accepted";
    let runtime = 0;
    let memory = 0;
    let error = null;

    for (const r of results) {
      if (r.status.id === 3) {
        passed++;
        runtime += Number(r.time || 0);
        memory = Math.max(memory, Number(r.memory || 0));
      } else {
        status = "Failed";
        error = r.stderr || r.compile_output || "Wrong Answer";
        break;
      }
    }

    submission.status = status;
    submission.testCasepassed = passed;
    submission.runtime = runtime;
    submission.memory = memory;
    submission.errormessage = error;
    await submission.save();

    if (
      status === "Accepted" &&
      !req.result.problemsolved.includes(problemid)
    ) {
      req.result.problemsolved.push(problemid);
      await req.result.save();
    }

    res.status(201).send(submission);
  } catch (err) {
    console.error("❌ Submit Code Error:", err.response?.data || err.message);
    res.status(500).send("Internal server error");
  }
};

// const runcode = async (req, res) => {
//   try {
//     const userid = req.result._id;
//     const problemid = req.params.id;
//     const { code, language } = req.body;

//     if (!userid || !problemid || !code || !language) {
//       return res.status(400).send("Missing required fields");
//     }

//     const problemindatabase = await problem.findById(problemid);
//     if (!problemindatabase) {
//       return res.status(404).send("Problem not found");
//     }

//     const languageid = getLanguageId(language);

//     const encode = (str) =>
//       Buffer.from(str || "", "utf-8").toString("base64");

//     const submissions = problemindatabase.visibleTestCases.map((testcase) => ({
//       source_code: encode(code),          // ✅ user full code
//       language_id: languageid,
//       stdin: encode(testcase.input),       // ✅ testcase input
//       expected_output: encode(testcase.output),
//     }));

//     const submitresult = await submitBatch(submissions, true);
//     const tokens = submitresult.map((r) => r.token);

//     const results = await submitToken(tokens);

//     res.status(200).send(results);
//   } catch (err) {
//     console.error("❌ Run Code Error:", err.response?.data || err.message);
//     res.status(500).send("Internal server error");
//   }
// };

const runcode = async (req, res) => {
  try {
    const userid = req.result._id;
    const problemid = req.params.id;
    const { code, language } = req.body;

    if (!userid || !problemid || !code || !language) {
      return res.status(400).send("Missing required fields");
    }

    const problemindatabase = await problem.findById(problemid);
    if (!problemindatabase) {
      return res.status(404).send("Problem not found");
    }

    const languageid = getLanguageId(language);

    const encode = (str) => Buffer.from(str || "", "utf-8").toString("base64");

    const getFullSourceCode = () => {
      const lang = String(language || "").toLowerCase();
      const driver =
        problemindatabase.drivercode?.find(
          (d) => String(d.language || "").toLowerCase() === lang
        ) || null;

      if (driver && (driver.importcode || driver.maincode)) {
        const top = driver.importcode || "";
        const bottom = driver.maincode || "";
        return `${top}\n${code}\n${bottom}`.trim();
      }

      // Fallback for legacy single-block driver
      if (driver?.initialcode) {
        return `${code}\n${driver.initialcode}`;
      }

      return code;
    };

    const fullSource = getFullSourceCode();

    const submissions = problemindatabase.visibleTestCases.map((testcase) => ({
      // Encode fields because Judge0 is called with base64_encoded=true
      source_code: encode(fullSource),
      language_id: languageid,
      stdin: encode(testcase.input),
      expected_output: encode(testcase.output),
    }));

    const submitresult = await submitBatch(submissions, true);
    const tokens = submitresult.map((r) => r.token);

    const results = await submitToken(tokens);
    results.forEach((r, i) => {
      // console.log(`Testcase ${i + 1}`);
      // console.log("Status:", r.status?.description);
      // console.log("Stdout:", JSON.stringify(r.stdout));
      // console.log(
      //   "Expected:",
      //   JSON.stringify(problemindatabase.visibleTestCases[i].output)
      // );
    });

    // ✅ VERDICT LOGIC
    let allPassed = true;

    const formattedResults = results.map((r, index) => {
      if (r.status.id !== 3) allPassed = false;

      const tc = problemindatabase.visibleTestCases?.[index] || {};

      return {
        testcase: index + 1,
        status: r.status.description,
        input: tc.input ?? null,
        expected_output: tc.output ?? null,
        output: r.stdout,
        error: r.stderr || r.compile_output || null,
      };
    });

    res.status(200).json({
      verdict: allPassed ? "Accepted" : "Not Accepted",
      results: formattedResults,
    });
  } catch (err) {
    console.error("❌ Run Code Error:", err.response?.data || err.message);
    res.status(500).send("Internal server error");
  }
};

module.exports = { submitcode, runcode };
