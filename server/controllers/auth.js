import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const authTokenKey = "auth-token";
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
};

const validRoles = ["student", "instructor"];

/** @type {import("express").RequestHandler} */
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required." });
  }
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid Format provided." });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists." });
  }

  // Create new user
  const user = new User({ name, email, password, role });
  await user.save();

  const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie(authTokenKey, token, cookieOptions);
  res.status(201).json({ message: "User created successfully." });
};

/** @type {import("express").RequestHandler} */
export const login = async (req, res) => {
  const { email, password, role } = req.body;

  // Basic validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid Format provided." });
  }

  // Find user by email
  const user = await User.findOne({ email, role });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie(authTokenKey, token, cookieOptions);
  res.status(200).json({ message: "Login successful." });
};

/** @type {import("express").RequestHandler} */
export const logout = (req, res) => {
  res.clearCookie(authTokenKey);
  res.status(200).json({ message: "Logout successful." });
};

/** @type {import("express").RequestHandler} */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

/** @type {import("express").RequestHandler} */
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};
