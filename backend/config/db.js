import mongoose from "mongoose";

const mongodb = "mongodb://localhost:27017/miles-and-smiles";

export async function connectDB() {
  try {
    await mongoose.connect(mongodb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error("Error connecting to MongoDB ❌");
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log("MongoDB Disconnected ✅");
  } catch (err) {
    console.error("Error disconnecting from MongoDB ❌");
  }
}
