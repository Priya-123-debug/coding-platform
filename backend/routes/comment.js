const express = require("express");
const usermiddleware = require("../middleware/usermiddleware");
const {
  createComment,
  getComments,
  deleteComment,
  toggleUpvote,
} = require("../Controllers/commentController");

const commentRouter = express.Router();

commentRouter.post("/:problemId", usermiddleware, createComment);
commentRouter.get("/:problemId", usermiddleware, getComments);
commentRouter.delete("/:id", usermiddleware, deleteComment);
commentRouter.post("/:id/upvote", usermiddleware, toggleUpvote);

module.exports = commentRouter;