const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { request } = require("express");

const usermiddleware = async (req, res, next) => {
  //   const token = req.headers["authorization"]?.split(" ")[1];
  // console.log("Token received:", token);
  //  const token = req.cookies.jwt; // <<< CHANGE THIS LINE BACK
  // console.log("Cookies received by server:", req.cookies); // Keep this for debugging

  // 1. Get token from HTTP-only cookie
  const token = req.cookies.token; // <<< CHANGE THIS LINE: Look for 'token' instead of 'jwt'

  try {
    // const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // console.log("Token received:", token);
    // console.log("Decoded token:", decoded);

    const result = await User.findById(decoded._id);

    // Check role
    // if (decoded.role !== "user") {
    //   return res.status(403).json({ message: "Access denied."});
    // }
    // Check role
    if (decoded.role !== "user" && decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    req.user = decoded; // attach decoded user info to request
    req.result = result;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = usermiddleware;
