const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const ErrorHandler = require("../utils/errorHandler");

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    token: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Generate JWT Token
userSchema.methods.getJWT = function () {
  try {
    return jwt.sign(
      { id: this._id, email: this.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  } catch (error) {
    console.error("Error generating JWT:", error.message);
    throw new Error("Failed to generate JWT token");
  }
};

// Compare Password
userSchema.methods.compareHashedPassword = async function (password) {
  try {
    if (!this.password) {
      throw new ErrorHandler("Password is missing from the user record", 500);
    }

    const isMatch = await bcrypt.compare(password, this.password);

    if (!isMatch) {
      throw new ErrorHandler("Email or Password is incorrect", 401);
    }

    return isMatch;
  } catch (error) {
    console.error("Password comparison error:", error.message);
    throw error instanceof ErrorHandler
      ? error
      : new ErrorHandler("Password comparison failed", 500);
  }
};

// Middleware: Hash Password Before Save
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password") || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    console.error("Error in pre-save middleware:", error.message);
    next(error);
  }
});

// Middleware: Handle Duplicate Email Error
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Email already exists"));
  } else {
    next(error);
  }
});

// Export User Model
module.exports = mongoose.model("User", userSchema);
