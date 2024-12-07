const { register, login, authenticate } = require("../controller/auth.js");
const express = require("express");
const ExamContent = require("../models/ExamContent.js");

const User = require("../models/User.js")

const router = express.Router();
const mongoose = require("mongoose");// Assuming the model is defined in a separate file

// POST request to create a new exam content for a specific username
router.post("/exam/:username", async (req, res) => {
    const { username } = req.params; // Extract username from the URL
    const {
        examTitle,
        registrationDate,
        preparationLink,
        books,
        category,
        examType,
        examApplicationLink,
        image,
    } = req.body;

    // Ensure that username is not null
    if (!username || !examTitle || !registrationDate || !preparationLink || !books || !category || !examType || !examApplicationLink) {
        return res.status(400).json({ message: "All required fields must be provided" });
    }

    try {
        // Create a new exam content document
        const newExamContent = new ExamContent({
            username, // Set the username from the URL
            examTitle,
            registrationDate,
            preparationLink,
            books,
            category,
            examType,
            examApplicationLink,
            image, // Optional field
        });

        // Save the document to MongoDB
        const savedExamContent = await newExamContent.save();

        // Return success response
        res.status(201).json({
            message: "Exam content created successfully",
            examContent: savedExamContent,
        });
    } catch (error) {
        console.error("Error creating exam content:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
