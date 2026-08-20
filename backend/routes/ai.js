const express = require("express");
const usermiddleware = require("../middleware/usermiddleware");
const { explainFailure } = require("../Controllers/aiController");
const airouter = express.Router();

airouter.post("/explain/:submissionId", usermiddleware, explainFailure);

module.exports = airouter;