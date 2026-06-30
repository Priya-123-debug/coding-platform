const User = require("../models/user");
const validate = require("../utilis/validator");
const bcrypt = require("bcrypt");
const Submission = require("../models/submission");

const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    // validate the data
    validate(req.body);
    const { firstname, emailid, password } = req.body;
    req.body.role = "user";
    req.body.password = await bcrypt.hash(password, 10);
    // ye email id already exist hai ya nhi

    // password ko strong krna hai to becrpty library use krna hai
    if (!emailid || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }
    const existingUser = await User.findOne({ emailid });
    if (existingUser) {
      console.error(
        "Registration failed: User with email",
        emailid,
        "already exists."
      );
      return res
        .status(409)
        .json({ error: "User with this email already exists." }); // 409 Conflict
    }

    const user = await User.create(req.body);
    const token = jwt.sign(
      { _id: user._id, emailid, role: "user" },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 60,
      }
    );
    const reply = {
      firstname: user.firstname,
      emailid: user.emailid,
      _id: user._id,
      role: user.role, // <-- include role
    };
    // res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.cookie("token", token, {
      httpOnly: true, // JS cannot access it
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: "none", // works with cross-origin requests
      secure: true, // required for sameSite: none
    });

    
    res.status(201).json({
      user: reply,
      message: "user registered successfully",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
    console.log(err);
  }
};

const login = async (req, res) => {
  try {
    const { emailid, password } = req.body;
    if (!emailid || !password) {
      throw new Error("emailid or password is missing");
    }
    const user = await User.findOne({ emailid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error("invalid credentials");
    }
    const token = jwt.sign(
      { _id: user._id, emailid, role: user.role },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 60,
      }
    );
    const reply = {
      firstname: user.firstname,
      emailid: user.emailid,
      _id: user._id,
      role: user.role, // <-- include role
    };
    res.cookie("token", token, {
      httpOnly: true, // JS cannot access it
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: "none", // works with cross-origin requests
      secure: true, // required for sameSite: none
    });
    res.status(200).json({
      user: reply,
      message: "user logged in successfully",
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
    console.log(err);
  }
};
// logout feature
const logout = (req, res) => {
  try {
    // let token = req.cookies.token;
    // token = "";
    res.clearCookie("token");
    // res.status(200).json({ message: "user logged out successfully" });

    // res.clearCookie("token");

    res.status(200).json({
      message: "user logged out successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
const adminregister = async (req, res) => {
  try {
    // validate the data
    if (req.user.role != "admin")
      throw new Error("only admin can create another admin");
    validate(req.body);
    const { firstname, emailid, lastname, age, password } = req.body;
    req.body.role = "admin";
    req.body.password = await bcrypt.hash(password, 10);
    // ye email id already exist hai ya nhi

    // password ko strong krna hai to becrpty library use krna hai

    const user = await User.create(req.body);
    const token = jwt.sign(
      { _id: user._id, emailid, role: "admin" },
      process.env.JWT_KEY,
      {
        // expiresIn: 60 * 60,
        expiresIn: "1h", // easier to read
      }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).json({
      message: "user registered successfully",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
    console.log(err);
  }
};
const deleteprofile = async (req, res) => {
  try {
    const userid = req.result._id;
    await User.findByIdAndDelete(userid);
    // submission se bhi delete krna hai
    Submission.deleteMany({ userId: userid });
    res.status(200).json({ message: "user profile deleted succesfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// unique marks karege schema me tabhi uinque index genrerate hoga easily find kr sakte hai like b++ treee
//  we create index by self that is called compound index so we can  easily find that data
// indexing is use to increase the performance of database
// easily find the data into logn
// index banane se thoda space jyada lagega
// indexing se query fast ho jata hai

module.exports = { register, login, logout, adminregister, deleteprofile };
