const ErrorHandler = require("../utils/errorHandler.js");
const User = require("../models/user");

// ✅ Signup Controller
const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("User already exists", 409));
    }

    const userData = new User({ name, email, password });
    const savedUser = await userData.save();

    return res.status(201).json({
      success: true,
      message: "Signup successfully",
      data: savedUser,
    });
  } catch (error) {
    next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};

// ✅ Login Controller
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Email and Password are required", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Email or Password is incorrect.", 401));
    }

    const isPasswordValid = await user.compareHashedPassword(password);
    if (!isPasswordValid) {
      return next(new ErrorHandler("Email or Password is incorrect.", 401));
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    next(
      error instanceof ErrorHandler
        ? error
        : new ErrorHandler("Login failed", 500)
    );
  }
};

// ✅ Logout Controller
const logout = async (req, res, next) => {
  try {
    res.cookie("token", "", { maxAge: 0 });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(new ErrorHandler("Something went wrong during logout", 500));
  }
};

module.exports = { signup, login, logout };
