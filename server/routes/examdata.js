// Get exam content by userId
const { register, login, authenticate } = require("../controller/auth.js");
const express = require("express");
const ExamContent = require("../models/ExamContent.js");

const User = require("../models/User.js")

const router = express.Router();



// Get exam content by query parameters
router.get("/exam", async (req, res) => {
    
    try {
      // Retrieve all exam contents from the database
      const examContents = await ExamContent.find({});

      if (!examContents || examContents.length === 0) {
          return res.status(404).json({ message: "No exam content found" });
      }

      // Send the retrieved exam content as the response
      res.status(200).json({
          message: "All exam content retrieved successfully",
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