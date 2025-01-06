const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Missing Token in the cookie",
      });
    }
    try {
      const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
      if (!decodeToken) {
        return res.status(401).json({
          success: false,
          message: "Invalid Token",
        });
      }
      const { id } = decodeToken;
      const user = await User.findById(id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }
      req.user = user;
      next();
    } catch (eer) {
      return res.status(401).json({
        success: false,
        message: "Expired Token",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong in authentication middleware.",
    });
  }
};
module.exports = auth;
