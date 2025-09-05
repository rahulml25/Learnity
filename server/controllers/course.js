import mongoose from "mongoose";
import Course from "../models/Course.js";

/** @type {import('express').RequestHandler} */
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .select("-enrolledStudents");
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

    const { title, description, overview, duration } = req.body;
    if (!title || !description || !duration) {
      return res
        .status(400)
        .json({ message: "Title, description, and duration are required." });
    }

    const course = new Course({
      title,
      description,
      overview: overview || "",
      duration,
      instructor,
    });
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

    let courses = await Course.aggregate([
      { $match: { instructor: new mongoose.Types.ObjectId(instructor) } },
      {
        $addFields: {
          enrolledStudentsCount: { $size: "$enrolledStudents" },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          overview: 1,
          duration: 1,
          instructor: 1,
          enrolledStudentsCount: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    // Step 2: populate instructor (name + email)
    courses = await Course.populate(courses, {
      path: "instructor",
      select: "name email",
    }).then((courses) =>
      courses.map(({ enrolledStudentsCount, ...course }) => ({
        ...course,
        enrolledStudents: { length: enrolledStudentsCount },
      }))
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
    })
      .populate("instructor", "name email")
      .select("-enrolledStudents");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

/** @type {import('express').RequestHandler} */
export const getCourseById = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const { id: userId, role } = req.user;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    const course = await Course.findById(courseId).populate(
      "instructor",
      "name email"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Check if current user is enrolled
    const isEnrolled = course.enrolledStudents.includes(userId);

    // Prepare course data based on user role
    const courseData = {
      ...course.toObject(),
      isEnrolled,
    };

    // Only include enrolled students if user is an instructor AND it's their course
    if (role === "instructor" && course.instructor._id.toString() === userId) {
      // Populate enrolled students with their details for instructors
      const courseWithStudents = await Course.findById(courseId)
        .populate("instructor", "name email")
        .populate("enrolledStudents", "name email");

      courseData.enrolledStudents = courseWithStudents.enrolledStudents;
    } else {
      // Remove enrolled students array for non-instructors or other instructors
      courseData.enrolledStudents = undefined;
    }

    res.status(200).json(courseData);
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

    const { title, description, overview, duration } = req.body;
    if (!title || !description || !duration) {
      return res
        .status(400)
        .json({ message: "Title, description, and duration are required." });
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      { title, description, overview: overview || "", duration },
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

/** @type {import('express').RequestHandler} */
export const getCoursesByInstructorId = async (req, res) => {
  try {
    const { instructorId } = req.params;

    if (!instructorId) {
      return res.status(400).json({ message: "Instructor ID is required." });
    }

    const courses = await Course.find({ instructor: instructorId })
      .populate("instructor", "name email")
      .select("-enrolledStudents");

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};
