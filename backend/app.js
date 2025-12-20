import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Routes from "./routes/index.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running :)");
});

// Routes
app.use("/auth", Routes.auth);
app.use("/user", Routes.user);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Uncaught Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
