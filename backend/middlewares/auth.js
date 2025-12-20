import { verifyToken } from "../utils/jwt.js";

export const auth = (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated.",
        data: null,
      });
    }

    const decoded = verifyToken(token);

    req.userId = decoded._id;
    next();
  } catch (err) {
    console.error("Authentication error:", err);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
      data: null,
    });
  }
};
