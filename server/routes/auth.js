import express from "express";
import {
  login,
  logout,
  signup,
  getMe,
  getUserProfile,
  updateProfile,
} from "../controllers/auth.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", authMiddleware, getMe);
router.get("/profile/:id", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateProfile);

export default router;
