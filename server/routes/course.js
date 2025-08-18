import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createCourse,
  deleteCourseById,
  enrollStudentInCourse,
  getCourseById,
  getCourses,
  getCoursesByInstructor,
  getCoursesByStudent,
  updateCourseById,
} from "../controllers/course.js";

const router = express.Router();

router.get("/", authMiddleware, getCourses);
router.post("/", authMiddleware, createCourse);

router.get("/created", authMiddleware, getCoursesByInstructor);
router.get("/enrolled", authMiddleware, getCoursesByStudent);

router.get("/:id", authMiddleware, getCourseById);
router.put("/:id", authMiddleware, updateCourseById);
router.delete("/:id", authMiddleware, deleteCourseById);

router.post("/:id/enroll", authMiddleware, enrollStudentInCourse);

export default router;
