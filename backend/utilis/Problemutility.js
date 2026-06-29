const axios = require("axios");

const waiting = async (timer) => {
  setTimeout(() => {
    return 1;
  }, timer);
};

const getLanguageId = (lang) => {
  const language = {
    "c++": 54,
    cpp: 54,
    python: 71,
    python3: 71,
    java: 62,
    javascript: 63,
    js: 63,
    c: 50,
    "c#": 51,
    go: 60,
    rust: 73,
    ruby: 72,
    swift: 83,
    kotlin: 78,
    scala: 81,
    php: 68,
    typescript: 74,
    r: 80,
  };
  return language[lang.toLowerCase()] || 54;
};

// const submitBatch = async (submissions, useBase64 = true) => {
//   const options = {
//       method: 'POST',
//       url: `https://judge0-ce.p.rapidapi.com/submissions/batch?&wait=false`,
//        params: {

//       base64_encoded: 'false',

//     },
//       headers: {
//         'content-type': 'application/json',
//         'x-rapidapi-key': 'c3f1e07d3amsh70931283891d384p1d1a84jsn28013a972321',
//         'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//       },
//       data: { submissions }
//     };

//   try {
//     const response = await axios.request(options);
//     console.log(" Response from Judge0 (token batch):", response.data);
//     return response.data;

//   } catch (err) {
//     console.error(" Error in submitBatch:", err.response?.data || err.message);
//     throw err;
//   }

//   }

// const submitToken = async (tokens) => {
//   const options = {
//     method: 'GET',
//     url: `https://judge0-ce.p.rapidapi.com/submissions/batch`,
//     params: {
//       tokens: tokens.join(','),
//       base64_encoded: 'false',
//       fields: '*'
//     },
//     headers: {
//       'x-rapidapi-key': 'YOUR_API_KEY',
//       'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//     }
//   };

//   while (true) {
//     try {
//       const response = await axios.request(options);
//       console.log("Response from Judge0 (result batch):", response.data);

//       const done = response.data.submissions.every(
//         r => r.status_id > 2
//       );

//       if (done) return response.data.submissions;

//       await waiting(1000);
//     } catch (err) {
//       console.error("Error in submitToken:", err.response?.data || err.message);
//       throw err;
//     }
//   }
// };

// Fetch results for multiple tokens
// const submitToken = async (tokens) => {
//   const options = {
//     method: "GET",
//     url: `https://ce.judge0.com/submissions/batch`,
//     params: {
//       tokens: tokens.join(","),
//       base64_encoded: false,
//       fields: "*",
//     },
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };

//   while (true) {
//     try {
//       const response = await axios.request(options);
//       console.log("Response from Judge0 (result batch):", response.data);

//       const done = response.data.submissions.every((r) => r.status.id > 2);

//       if (done) return response.data.submissions;

//       await waiting(1000); // wait 1 second and retry
//     } catch (err) {
//       console.error("Error in submitToken:", err.response?.data || err.message);
//       throw err;
//     }
//   }
// };

// module.exports = { submitBatch, submitToken };

const encodeBase64 = (str) => Buffer.from(str, "utf8").toString("base64");

const submitBatch = async (submissions) => {
  // Encode each initialcode in base64
  const encodedSubmissions = submissions.map((s) => ({
    ...s,
    source_code: s.source_code,
  }));

  // console.log("Encoded Submissions:", encodedSubmissions);

  try {
    const response = await axios.post(
      `https://ce.judge0.com/submissions/batch?base64_encoded=true&wait=false`,
      { submissions: encodedSubmissions },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (err) {
    console.error("Error in submitBatch:", err.response?.data || err.message);
    throw err;
  }
};
const decodeBase64 = (str) => Buffer.from(str, "base64").toString("utf8");

const submitToken = async (tokens) => {
  const options = {
    method: "GET",
    url: "https://ce.judge0.com/submissions/batch",
    params: {
      tokens: tokens.join(","),
      base64_encoded: true,
      fields: "*",
    },
    headers: { "Content-Type": "application/json" },
  };

  while (true) {
    const response = await axios.request(options);

    const done = response.data.submissions.every((r) => r.status.id > 2);

    if (done) {
      // Decode source_code or stdout if needed
      response.data.submissions.forEach((s) => {
        if (s.stdout) s.stdout = decodeBase64(s.stdout);
        if (s.compile_output) s.compile_output = decodeBase64(s.compile_output);
      });
      return response.data.submissions;
    }

    await new Promise((r) => setTimeout(r, 1000));
  }
};

module.exports = {
  getLanguageId,
  submitBatch,
  submitToken,
};
