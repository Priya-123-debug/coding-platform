const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "problem",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null, 
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    upvotes: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

commentSchema.index({ problemId: 1, createdAt: -1 });
commentSchema.index({ parentId: 1 });

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;