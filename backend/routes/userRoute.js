const express = require("express");
const route = express.Router();
const { signup, login, logout } = require("../components/user");

// User authentication routes
route.route("/signup").post(signup); // POST /signup
route.route("/login").post(login); // POST /login
route.route("/logout").post(logout); // POST /logout

module.exports = route;
