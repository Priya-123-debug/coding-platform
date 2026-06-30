const express = require("express");
const usermiddleware = require("../middleware/usermiddleware");
const {
  getHeatmap,
  getStats,
  getLanguages,
  getTopics,
  getAchievements,
  getMistakes,
  getRecent,
} = require("../Controllers/analyticsController");

const analyticsRouter = express.Router();

analyticsRouter.get("/heatmap", usermiddleware, getHeatmap);
analyticsRouter.get("/stats", usermiddleware, getStats);
analyticsRouter.get("/languages", usermiddleware, getLanguages);
analyticsRouter.get("/topics", usermiddleware, getTopics);
analyticsRouter.get("/achievements", usermiddleware, getAchievements);
analyticsRouter.get("/mistakes", usermiddleware, getMistakes);
analyticsRouter.get("/recent", usermiddleware, getRecent);

module.exports = analyticsRouter;