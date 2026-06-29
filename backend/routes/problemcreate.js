// create
// fetch
// delete
// update
// delelete
// console.log("Problem router loaded");
const express = require("express");

const {
  createproblem,
  updateproblem,
  deleteproblem,
  getproblembyid,
  getallproblem,
  solvedproblembyuser,
  submittedproblem,
} = require("../Controllers/userproblem");
const adminMiddleware = require("../middleware/adminmiddleware");
const usermiddleware = require("../middleware/usermiddleware");

const { Schema } = require("../models/problem");
const problemrouter = express.Router();
problemrouter.post("/create", adminMiddleware, createproblem);

// problemrouter.post("/create", adminMiddleware, createproblem);
problemrouter.put("/update/:id", adminMiddleware, updateproblem);
problemrouter.delete("/delete/:id", adminMiddleware, deleteproblem);

problemrouter.get("/problembyid/:id", usermiddleware, getproblembyid);
problemrouter.get("/getallproblem", usermiddleware, getallproblem);

problemrouter.get("/problemsolvedbyuser", usermiddleware, solvedproblembyuser);
problemrouter.get("/submittedproblem/:id", usermiddleware, submittedproblem);
module.exports = problemrouter;
