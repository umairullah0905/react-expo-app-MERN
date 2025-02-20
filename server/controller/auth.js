const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


//authentication function 

const authenticate = (roles) => (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, "secretKey");
        req.user = decoded;

        if (roles && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

//registering new user fucntion

const register = async (req, res) => {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role });
    await user.save();
    res.status(201).json({ message: "User Registered" });
};

// login function for already existing user

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, "secretKey", {
        expiresIn: "1h",
    });

    res.json({
        token,
        id: user._id,
        role: user.role,
        username: user.username
    });
};

module.exports = {
    authenticate,
    register,
    login,
};
