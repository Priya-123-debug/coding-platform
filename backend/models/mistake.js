const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mistakeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problemId: {
      type: Schema.Types.ObjectId,
      ref: "problem",
      required: true,
    },

    submissionId: {
      type: Schema.Types.ObjectId,
      ref: "Submission",
      required: false,
    },

    note: {
      type: String,
      required: true,
      trim: true,
    },

    resolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Mistake", mistakeSchema);