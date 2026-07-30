import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const sanitizedUri = process.env.MONGODB_URI
      ? process.env.MONGODB_URI.replace(/\/\/.*@/, "//***:***@")
      : "undefined";
    console.log(`Connecting to: ${sanitizedUri}`);
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

    try {
      await mongoose.connection.db.collection("applications").dropIndex("user_1_job_1");
      console.log("✅ Dropped old applications index successfully");
    } catch (err) {
      if (err.codeName !== "IndexNotFound" && err.message !== "ns not found") {
        console.warn("⚠️ Warning dropping index (ignored):", err.message);
      }
    }
  } catch (error) {
    console.log("❌ MongoDB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;