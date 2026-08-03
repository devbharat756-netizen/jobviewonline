import mongoose from "mongoose";
import User from "../modules/user/models/user.model.js";
import bcrypt from "bcryptjs";
import Job from "../modules/job/models/job.model.js";
import Freelance from "../modules/job/models/freelance.model.js";

const connectDB = async () => {
  try {
    const sanitizedUri = process.env.MONGODB_URI
      ? process.env.MONGODB_URI.replace(/\/\/.*@/, "//***:***@")
      : "undefined";
    console.log(`Connecting to: ${sanitizedUri}`);
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

    // Seed default admin user
    try {
      const adminExists = await User.findOne({ role: "admin" });
      if (!adminExists) {
        console.log("Seeding default admin user...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("vivek789456", salt);
        await User.create({
          name: "Admin",
          email: "admin@viewjob.online",
          phone: "0000000000",
          password: hashedPassword,
          role: "admin",
        });
        console.log("✅ Default admin user seeded successfully (admin@viewjob.online / vivek789456)");
      }
    } catch (seedErr) {
      console.warn("⚠️ Warning seeding admin user (ignored):", seedErr.message);
    }

    // Migrate legacy jobs/projects to status: "approved"
    try {
      const jobMigration = await Job.updateMany({ status: { $exists: false } }, { status: "approved" });
      const freelanceMigration = await Freelance.updateMany({ status: { $exists: false } }, { status: "approved" });
      if (jobMigration.modifiedCount > 0 || freelanceMigration.modifiedCount > 0) {
        console.log(`✅ Migrated legacy data: ${jobMigration.modifiedCount} jobs and ${freelanceMigration.modifiedCount} freelance projects set to "approved".`);
      }
    } catch (migrateErr) {
      console.warn("⚠️ Legacy migration warning (ignored):", migrateErr.message);
    }

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