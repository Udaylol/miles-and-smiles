import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";

async function startServer() {
  try {
    await connectDB();
    const server = http.createServer(app);
    server.listen(3000, () => {
      console.log("Server started on http://localhost:3000 ✅");
    });
  } catch (err) {
    console.error("Error starting server ❌");
    console.error(err);
  }
}

startServer();
