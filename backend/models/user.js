const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },

    lastname: {
      type: String,
      required: false,
      minlength: 3,
      maxlength: 20,
    },
    emailid: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      immutable: true,
    },
    age: {
      type: Number,
      min: 10,
      max: 80,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    problemsolved: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "problem",
        },
      ],
      // unique:true,
      default: [],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
