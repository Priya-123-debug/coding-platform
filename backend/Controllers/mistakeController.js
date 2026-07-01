const Submission = require("../models/submission");
const Mistake = require("../models/mistake");


// Create note
exports.createMistake = async (req, res) => {
  try {
    const userId = req.result._id; // or req.user._id if your middleware uses req.user
    const { problemId, note } = req.body;

    // Validate
    if (!problemId) {
      return res.status(400).json({
        message: "Problem ID is required",
      });
    }

    if (!note || !note.trim()) {
      return res.status(400).json({
        message: "Note is required",
      });
    }

    // Check if note already exists for this user + problem
    const existingMistake = await Mistake.findOne({
      userId,
      problemId,
    });

    if (existingMistake) {
      return res.status(400).json({
        message: "Learning note already exists for this problem",
      });
    }

    // Create note
    const mistake = await Mistake.create({
      userId,
      problemId,
      note: note.trim(),
    });

    return res.status(201).json({
      message: "Learning note created successfully",
      mistake,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
// Get all notes for logged-in user
exports.getAllMistakes = async (req, res) => {
  try {
    const userId = req.result._id;
    const mistakes = await Mistake.find({ userId })
      .populate("problemId", "title difficulty tags")
      .sort({ createdAt: -1 });
    res.status(200).json(mistakes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get note for a specific problem (for MyNote tab)
exports.getNoteByProblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const { problemId } = req.params;
    const note = await Mistake.findOne({ userId, problemId });
    res.status(200).json(note || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update note content
exports.updateMistake = async (req, res) => {
  try {
    const userId = req.result._id;
    const updated = await Mistake.findOneAndUpdate(
      { _id: req.params.id, userId },
      { note: req.body.note },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Note not found" });
    if (!req.body.note || !req.body.note.trim()) {
  return res.status(400).json({
    message: "Note is required",
  });
}
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark as resolved
exports.markResolved = async (req, res) => {
  try {
    const userId = req.result._id;
    const updated = await Mistake.findOneAndUpdate(
      { _id: req.params.id, userId },
      { resolved: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete note
exports.deleteMistake = async (req, res) => {
  try {
    const userId = req.result._id;
    await Mistake.findOneAndDelete({ _id: req.params.id, userId });
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};