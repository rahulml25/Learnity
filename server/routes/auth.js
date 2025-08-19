import express from "express";
import { login, logout, signup, getMe } from "../controllers/auth.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", authMiddleware, getMe);

export default router;
