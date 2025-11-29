import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Routes from "./routes/index.js";
import multer from "multer";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Test Route
app.get("/health", (req, res) => {
  res.send("Miles and Smiles Backend is running :)");
});

// Routes
app.use("/api/auth", Routes.auth);
app.use("/api/user", Routes.user);
app.use("/api/friends", Routes.friend);

// Error Handling Middlewares
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Only one file can be uploaded",
        data: null,
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Unexpected file field",
        data: null,
      });
    }

    return res.status(400).json({
      success: false,
      message: "File upload error",
      data: null,
    });
  }

  next(err);
});

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
