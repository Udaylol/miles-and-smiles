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

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
