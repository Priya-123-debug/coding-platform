const Comment = require("../models/comment");

const createComment = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { content, parentId = null } = req.body;
    const userId = req.result._id;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const comment = await Comment.create({
      problemId,
      userId,
      parentId: parentId || null,
      content: content.trim(),
    });

    const populated = await comment.populate("userId", "firstname email role");
    return res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { problemId } = req.params;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 15, 50);
    const skip = (page - 1) * limit;

    // Top-level comments only, paginated
    const [comments, total] = await Promise.all([
      Comment.find({ problemId, parentId: null })
        .populate("userId", "firstname email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Comment.countDocuments({ problemId, parentId: null }),
    ]);

    // Fetch all replies for these top-level comments in one query
    const parentIds = comments.map(c => c._id);
    const replies = await Comment.find({ parentId: { $in: parentIds } })
      .populate("userId", "firstname email role")
      .sort({ createdAt: 1 });

    const repliesByParent = {};
    replies.forEach(r => {
      const key = r.parentId.toString();
      if (!repliesByParent[key]) repliesByParent[key] = [];
      repliesByParent[key].push(r);
    });

    const result = comments.map(c => ({
      ...c.toObject(),
      replies: repliesByParent[c._id.toString()] || [],
    }));

    return res.status(200).json({
      comments: result,
      pagination: {
        page, limit, total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isOwner = comment.userId.toString() === req.result._id.toString();
    const isAdmin = req.result.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Also delete replies if this is a top-level comment
    await Comment.deleteMany({ $or: [{ _id: id }, { parentId: id }] });
    return res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleUpvote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.result._id;
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const idx = comment.upvotes.findIndex(u => u.toString() === userId.toString());
    if (idx === -1) {
      comment.upvotes.push(userId);
    } else {
      comment.upvotes.splice(idx, 1);
    }
    await comment.save();
    return res.status(200).json({ upvotes: comment.upvotes.length, upvoted: idx === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createComment, getComments, deleteComment, toggleUpvote };