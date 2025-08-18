import Course from "../models/Course.js";
import User from "../models/User.js";

/** @type {import('express').RequestHandler} */
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().select("-enrolledStudents");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

/** @type {import('express').RequestHandler} */
export const createCourse = async (req, res) => {
  try {
    const { id: instructor, role } = req.user;
    if (role !== "instructor") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only instructors can create courses." });
    }

    const { title, description, duration } = req.body;
    if (!title || !description || !duration) {
      return res
        .status(400)
        .json({ message: "Title, description, and duration are required." });
    }

    const course = new Course({ title, description, duration, instructor });
    await course.save();

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

/** @type {import('express').RequestHandler} */
export const getCoursesByInstructor = async (req, res) => {
  try {
    const { role, id: instructor } = req.user;
    if (role !== "instructor") {
      return res.status(403).json({
        message: "Forbidden: Only instructors can view their courses.",
      });
    }

    const courses = await Course.find({ instructor }).select(
      "-enrolledStudents"
    );
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

/** @type {import('express').RequestHandler} */
export const getCoursesByStudent = async (req, res) => {
  try {
    const { role, id: student } = req.user;
    if (role !== "student") {
      return res.status(403).json({
        message: "Forbidden: Only students can view their enrolled courses.",
      });
    }

    const courses = await Course.find({
      enrolledStudents: { $in: [student] },
    }).select("-enrolledStudents");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

/** @type {import('express').RequestHandler} */
export const getCourseById = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    const course = await Course.findById(courseId).select("-enrolledStudents");
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

/** @type {import('express').RequestHandler} */
export const updateCourseById = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "instructor") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only instructors can update courses." });
    }

    const { id: courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    const { title, description, duration } = req.body;
    if (!title || !description || !duration) {
      return res
        .status(400)
        .json({ message: "Title, description, and duration are required." });
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      { title, description, duration },
      { new: true }
    ).select("-enrolledStudents");
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

/** @type {import('express').RequestHandler} */
export const deleteCourseById = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "instructor") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only instructors can delete courses." });
    }

    const { id: courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

/** @type {import('express').RequestHandler} */
export const enrollStudentInCourse = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const { id: student } = req.user;

    if (!courseId || !student) {
      return res
        .status(400)
        .json({ message: "Course ID and Student ID are required." });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    if (course.enrolledStudents.includes(student)) {
      return res
        .status(400)
        .json({ message: "Student is already enrolled in this course." });
    }

    course.enrolledStudents.push(student);
    await course.save();

    res.status(200).json({ message: "Student enrolled successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};
