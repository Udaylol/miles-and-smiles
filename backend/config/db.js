import mongoose from "mongoose";

const mongodb = "mongodb://localhost:27017/miles-and-smiles";

export default async function connectDB() {
  try {
    await mongoose.connect(mongodb);
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error("Error connecting to MongoDB ❌");
  }
}
