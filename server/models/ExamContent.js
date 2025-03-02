const mongoose = require("mongoose");



const examContentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,   
    },
    examTitle: {
        type: String,
        required: true,
    },
    registrationDate: {
        type: String,
        required: true,
    },
    preparationLink: {
        type: String,
        required: true,
    },
    books: {
        type: [String], // Array of strings for book titles
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    examType: {
        type: String,
        required: true,
    },
    examApplicationLink: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
}, { timestamps: true });



module.exports = mongoose.model("ExamContent", examContentSchema);
