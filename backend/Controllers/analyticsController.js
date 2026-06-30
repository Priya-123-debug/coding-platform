const Submission = require("../models/submission");
const Problem = require("../models/problem");

// ---------- HEATMAP ----------
const getHeatmap = async (req, res) => {
  try {
    const userId = req.result._id;

    const submissions = await Submission.find(
      { userId },
      { createdAt: 1 }
    );

    const countByDate = {};
    submissions.forEach((s) => {
      const date = s.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD
      countByDate[date] = (countByDate[date] || 0) + 1;
    });

    const heatmapData = Object.entries(countByDate).map(([date, count]) => ({
      date,
      count,
    }));

    res.status(200).json(heatmapData);
  } catch (err) {
    console.error("getHeatmap error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ---------- STATS ----------
const getStats = async (req, res) => {
  try {
    const userId = req.result._id;

    const statusCounts = await Submission.aggregate([
      { $match: { userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const stats = {
      accepted: 0,
      wrongAnswer: 0,
      runtimeError: 0,
      compilationError: 0,
      pending: 0,
    };

    statusCounts.forEach(({ _id, count }) => {
      switch (_id) {
        case "Accepted":
          stats.accepted = count;
          break;
        case "Wrong Answer":
          stats.wrongAnswer += count;
          break;
        case "Time Limit":
          stats.wrongAnswer += count; // grouped with WA for simplicity, change if you want a separate bucket
          break;
        case "Runtime Error":
          stats.runtimeError = count;
          break;
        case "Compilation Error":
          stats.compilationError = count;
          break;
        case "Failed":
          stats.wrongAnswer += count; // legacy/fallback bucket
          break;
        case "pending":
          stats.pending = count;
          break;
      }
    });

    // ---- Streak calculation ----
    const acceptedSubs = await Submission.find(
      { userId, status: "Accepted" },
      { createdAt: 1 }
    ).sort({ createdAt: -1 });

    const acceptedDates = new Set(
      acceptedSubs.map((s) => s.createdAt.toISOString().slice(0, 10))
    );

    let currentStreak = 0;
    let cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    while (true) {
      const key = cursor.toISOString().slice(0, 10);
      if (acceptedDates.has(key)) {
        currentStreak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        // allow today to be empty without breaking streak (in case user hasn't solved today yet)
        if (currentStreak === 0 && key === new Date().toISOString().slice(0, 10)) {
          cursor.setDate(cursor.getDate() - 1);
          continue;
        }
        break;
      }
    }

    res.status(200).json({ ...stats, currentStreak });
  } catch (err) {
    console.error("getStats error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ---------- LANGUAGES ----------
const getLanguages = async (req, res) => {
  try {
    const userId = req.result._id;

    const counts = await Submission.aggregate([
      { $match: { userId } },
      { $group: { _id: "$language", count: { $sum: 1 } } },
    ]);

    const total = counts.reduce((sum, c) => sum + c.count, 0);

    const languages = counts.map((c) => ({
      language: c._id,
      count: c.count,
      percentage: total ? Math.round((c.count / total) * 100) : 0,
    }));

    res.status(200).json(languages);
  } catch (err) {
    console.error("getLanguages error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ---------- TOPICS ----------
// Assumes your Problem model has a "tags" array field. Adjust field name if different.
const getTopics = async (req, res) => {
  try {
    const userId = req.result._id;

    const acceptedSubs = await Submission.find(
      { userId, status: "Accepted" },
      { problemId: 1 }
    ).populate("problemId", "tags");

    const topicCounts = {};
    acceptedSubs.forEach((sub) => {
      const tags = sub.problemId?.tags || [];
      tags.forEach((tag) => {
        topicCounts[tag] = (topicCounts[tag] || 0) + 1;
      });
    });

    const total = Object.values(topicCounts).reduce((a, b) => a + b, 0);

    const topics = Object.entries(topicCounts).map(([topic, count]) => ({
      topic,
      count,
      percentage: total ? Math.round((count / total) * 100) : 0,
    }));

    res.status(200).json(topics);
  } catch (err) {
    console.error("getTopics error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ---------- ACHIEVEMENTS ----------
const getAchievements = async (req, res) => {
  try {
    const userId = req.result._id;

    const acceptedCount = await Submission.countDocuments({
      userId,
      status: "Accepted",
    });

    const distinctSolved = await Submission.distinct("problemId", {
      userId,
      status: "Accepted",
    });

    const achievements = [];

    if (distinctSolved.length >= 1) {
      achievements.push({ icon: "🎯", title: "First Problem Solved" });
    }
    if (distinctSolved.length >= 10) {
      achievements.push({ icon: "🔥", title: "10 Problems Solved" });
    }
    if (distinctSolved.length >= 50) {
      achievements.push({ icon: "🏆", title: "50 Problems Solved" });
    }
    if (acceptedCount >= 100) {
      achievements.push({ icon: "💯", title: "100 Accepted Submissions" });
    }

    res.status(200).json(achievements);
  } catch (err) {
    console.error("getAchievements error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ---------- MISTAKES ----------
const getMistakes = async (req, res) => {
  try {
    const userId = req.result._id;

    const failedSubs = await Submission.find({
      userId,
      status: { $in: ["Wrong Answer", "Runtime Error", "Compilation Error", "Time Limit", "Failed"] },
    })
      .populate("problemId", "title tags")
      .sort({ createdAt: -1 })
      .limit(50);

    const grouped = {};
    failedSubs.forEach((sub) => {
      const tags = sub.problemId?.tags || ["General"];
      tags.forEach((tag) => {
        if (!grouped[tag]) {
          grouped[tag] = { topic: tag, occurrences: 0, note: sub.errormessage || sub.status };
        }
        grouped[tag].occurrences++;
      });
    });

    const mistakes = Object.values(grouped).sort((a, b) => b.occurrences - a.occurrences);

    res.status(200).json(mistakes);
  } catch (err) {
    console.error("getMistakes error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ---------- RECENT ----------
const getRecent = async (req, res) => {
  try {
    const userId = req.result._id;

    const recentSubs = await Submission.find({ userId })
      .populate("problemId", "title")
      .sort({ createdAt: -1 })
      .limit(10);

    const recent = recentSubs.map((sub) => ({
      title: sub.problemId?.title || "Unknown Problem",
      status: sub.status,
      language: sub.language,
      createdAt: sub.createdAt,
    }));

    res.status(200).json(recent);
  } catch (err) {
    console.error("getRecent error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getHeatmap,
  getStats,
  getLanguages,
  getTopics,
  getAchievements,
  getMistakes,
  getRecent,
};