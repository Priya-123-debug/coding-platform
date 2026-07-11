const express = require("express");
const usermiddleware = require("../middleware/usermiddleware");
const { submitcode, runcode,getSubmissionsByProblem } = require("../Controllers/usersubmission");
const submitrouter = express.Router();
submitrouter.post("/submit/:id", usermiddleware, submitcode);
submitrouter.get("/problem/:id", usermiddleware, getSubmissionsByProblem);
submitrouter.post("/run/:id", usermiddleware, runcode);

module.exports = submitrouter;
