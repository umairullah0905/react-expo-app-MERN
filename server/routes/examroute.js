const { register, login, authenticate } = require("../controller/auth.js");
const express = require("express");
const ExamContent = require("../models/ExamContent.js");

const User = require("../models/User.js")

const router = express.Router();


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

    const parsedDate = new Date(registrationDate);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid registration date format" });
    }

    try {
        // Create a new exam content document
        const newExamContent = new ExamContent({
            username, // Set the username from the URL
            examTitle,
            registrationDate: parsedDate,
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




router.post('/exam/:_id/examid/:exam_id', async (req, res) => {
    const userId = req.params._id;
    const examId = req.params.exam_id;

    try {
        // Validate the exam ID exists
        const examExists = await ExamContent.findById(examId);
        if (!examExists) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Update the user's myInterest array
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { myInterest: examId } }, // Avoids duplicates
            { new: true } // Returns the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Exam added to interests', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.get('/user/:_id/myInterests', async (req, res) => {
    const userId = req.params._id;

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch details of all exams in myInterest
        const exams = await ExamContent.find({ _id: { $in: user.myInterest } });

        res.status(200).json({ message: 'My interests fetched successfully', exams });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});




module.exports = router;
