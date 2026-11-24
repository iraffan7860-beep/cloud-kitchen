import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import connectDB from "../config/db.js";

const createAdmin = async () => {
  try {
    if (
      !process.env.ADMIN_EMAIL ||
      !process.env.ADMIN_PASSWORD ||
      !process.env.JWT_SECRET
    ) {
      throw new Error("Admin credentials or JWT secret missing in .env");
    }

    await connectDB();

    const email = process.env.ADMIN_EMAIL.toLowerCase().trim();

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      12
    );

    await Admin.create({
      name: "FC Kitchen Admin",
      email,
      password: hashedPassword
    });

    console.log("FC Kitchen Admin created successfully!");
  } catch (error) {
    console.error("Admin creation failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();