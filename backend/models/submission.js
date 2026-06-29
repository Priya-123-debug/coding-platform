const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const submissionSchema = new Schema(
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
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["cpp", "python", "javascript", "java"],
      required: true,
    },
    status: {
      type: String,
   enum: [
  "pending",
  "Accepted",
  "Failed",
  "Wrong Answer",
  "Time Limit",
  "Compilation Error",
  "Runtime Error"
],

      default: "pending",
    },
    runtime: {
      type: Number,
      default: 0,
    },
    memory: {
      type: Number,
      default: 0,
    },
    errormessage: {
      type: String,
      default: "",
    },
    testCasepassed: {
      type: Number,
      default: 0,
    },

    testCasetotal: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
submissionSchema.index({ userId: 1, problemId: 1 }); // create compund index in ascending order
// -1 means decending order me marks krna  // sort me easily use kr sakte hai indexing hai optimize form of combination me laga sakte hai binary search bhi use kr sakte hai search krne ke li
//ye // ek schema ke multiple index bhi bana sakte hai
// index space jyada lega but query fast ho jayega 15 percent total data ka space consume krta hai index
// index se data sort ho jata hai easily
const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;
