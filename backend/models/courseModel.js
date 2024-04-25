const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  description: String,
  credits: Number,
  facultyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
