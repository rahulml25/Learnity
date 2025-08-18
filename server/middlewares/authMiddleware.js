import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authTokenKey } from "../controllers/auth.js";

/** @type {import('express').RequestHandler} */
const authMiddleware = async (req, res, next) => {
  const authToken = req.cookies[authTokenKey];

  if (!authToken) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

export default authMiddleware;
