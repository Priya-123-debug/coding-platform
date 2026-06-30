const express = require("express");
const usermiddleware = require("../middleware/usermiddleware");
const adminMiddleware = require("../middleware/adminmiddleware");
const {
  createproblem,
  updateproblem,
  deleteproblem,
  getproblembyid,
  getallproblem,
  solvedproblembyuser,
  submittedproblem,
  getallsubmissions, // make sure this is imported here too
} = require("../Controllers/userproblem");

const problemrouter = express.Router(); // ✅ declared first

problemrouter.post("/create", adminMiddleware, createproblem);
problemrouter.put("/update/:id", adminMiddleware, updateproblem);
problemrouter.delete("/delete/:id", adminMiddleware, deleteproblem);

problemrouter.get("/problembyid/:id", usermiddleware, getproblembyid);
problemrouter.get("/getallproblem", usermiddleware, getallproblem);

problemrouter.get("/problemsolvedbyuser", usermiddleware, solvedproblembyuser);
problemrouter.get("/submittedproblem/:id", usermiddleware, submittedproblem);

// ✅ new route, added after declaration
problemrouter.get("/allsubmissions", usermiddleware, getallsubmissions);

module.exports = problemrouter;