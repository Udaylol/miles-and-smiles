import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

const app = express();
const port = 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
