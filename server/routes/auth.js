const { register, login, authenticate } = require("../controller/auth.js");
const express = require("express");

const router = express.Router();

// Create a user
router.post("/register", register);

// Sign in
router.post("/login", login);

// Admin route
router.get("/admin", authenticate(["admin"]), (req, res) => {
    res.json({ message: "Welcome Admin!" });
});

// User route
router.get("/user", authenticate(["user", "admin"]), (req, res) => {
    res.json({ message: "Welcome User!" });
});

module.exports = router;
