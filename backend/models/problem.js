const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const problemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
  },
  tags: {
    // type:String,
    type: [String],
    enum: [
      "array",
      "string",
      "dp",
      "tree",
      "graph",
      "math",
      "greedy",
      "backtracking",
    ],
    required: true,
  },
  visibleTestCases: [
    {
      displayInput: {
        type: String,
        required: true,
      },
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
      explanation: {
        type: String,
        required: true,
      },
    },
  ],
  hiddenTestCases: [
    {
      displayInput: {
        type: String,
        required: true,
      },
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
    },
  ],
  startcode: [
    {
      language: {
        type: String,
        required: true,
      },
      initialcode: {
        type: String,
        required: true,
      },
    },
  ],
  drivercode: [
    {
      language: {
        type: String,
        required: false,
      },
      // Optional top part (e.g., includes/imports)
      importcode: {
        type: String,
        required: false,
      },
      // Optional bottom part (e.g., int main / runner)
      maincode: {
        type: String,
        required: false,
      },
      // Legacy single-block driver (kept for backward compatibility)
      initialcode: {
        type: String,
        required: false,
      },
    },
  ],
  referencesolution: [
    {
      language: {
        type: String,
        required: true,
      },
      initialcode: {
        type: String,
        required: true,
      },
    },
  ],

  problemcreator: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    // ek scehema dusre schema ko refer kr raha hai taki usme se data le sake or uske basis pe kuch kr sake or store na krna pade sara info
  },
});
const problem = mongoose.model("problem", problemSchema);
module.exports = problem;
