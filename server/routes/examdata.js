// Get exam content by userId
const { register, login, authenticate } = require("../controller/auth.js");
const express = require("express");
const ExamContent = require("../models/ExamContent.js");

const User = require("../models/User.js")

const router = express.Router();



// Get exam content by query parameters
router.get("/exam", async (req, res) => {
    const { examTitle, category, examType } = req.query; // Extract query parameters

    try {
        // Build the query object dynamically
        const query = {};
        if (examTitle) query.examTitle = examTitle;
        if (category) query.category = category;
        if (examType) query.examType = examType;

        // Find exam contents matching the query
        const examContents = await ExamContent.find(query);

        if (!examContents || examContents.length === 0) {
            return res.status(404).json({ message: "No exam content found matching the criteria" });
        }

        // Send the retrieved exam content as the response
        res.status(200).json({
            message: "Exam content retrieved successfully",
            examContents,
        });
    } catch (error) {
        console.error("Error retrieving exam content:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/exam/:_id', async (req, res) => {
    const { _id } = req.params;
  
    try {
      // Find the exam content by userId
      const exam = await ExamContent.findOne({ _id });
  
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }
  
      // Return the exam content
      res.status(200).json(exam);
    } catch (err) {
      console.error('Error fetching exam content:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router; 