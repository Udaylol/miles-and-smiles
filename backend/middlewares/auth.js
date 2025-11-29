import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

export const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated.",
        data: null,
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = await User.findById(decoded._id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
        data: null,
      });
    }

    next();
  } catch (err) {
    console.error("Auth error:", err);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
      data: null,
    });
  }
};
