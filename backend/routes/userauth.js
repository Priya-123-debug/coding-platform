const express = require("express");

const authrouter = express.Router();
const {
  register,
  login,
  logout,
  adminregister,
  deleteprofile,
} = require("../Controllers/userAuthent");

const adminMiddleware = require("../middleware/adminmiddleware");
const usermiddleware = require("../middleware/usermiddleware");

authrouter.post("/register", register);
authrouter.post("/login", login);
authrouter.post("/logout", logout);
authrouter.post("/admin/register", adminMiddleware, adminregister);
authrouter.get("/profile", usermiddleware, deleteprofile);
authrouter.get("/check", usermiddleware, (req, res) => {
  const reply = {
    firstname: req.result.firstname,
    emailid: req.result.emailid,
    _id: req.result._id,
    role: req.result.role,
  };
  res.status(200).json({
    user: reply,
    message: "valid user",
  });
});
// authrouter.get('getprofile',getprofile);
// here register login logout is function that is made in controller
module.exports = authrouter;
