const express = require("express");
const usermiddleware = require("../middleware/usermiddleware");
const { explainFailure } = require("../Controllers/aiController");

const airouter = express.Router();

// Register both POST and GET routes
airouter.post("/explain/:submissionId", usermiddleware, explainFailure);
airouter.get("/explain/:submissionId", usermiddleware, explainFailure);

module.exports = airouter;