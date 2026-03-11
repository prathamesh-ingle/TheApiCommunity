import mongoose from "mongoose";
import dotenv from "dotenv";
/* import bcrypt from "bcryptjs"; */
import Admin from '../src/models/AdminModel.js'

dotenv.config();

const seedAdmin = async () => {
  try {
    const uri=process.env.MONGO_URL.trim();
    console.log("Debug URI:", uri);
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected!");

    const adminEmail = "sanketbochare90@gmail.com"; // Change this to your actual email

    // Check if we already seeded the admin
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists in the database. Aborting.");
      process.exit(0);
    }

    // Encrypt the God-Mode password
    //const salt = await bcrypt.genSalt(10);
    const hashedPassword ="sanketBochare@2005" //await bcrypt.hash("sanketBochare@2005", salt); // Change this password!

    await Admin.create({
      name: "Sanket Bochare", // Or "PayNidhi Super Admin"
      email: adminEmail,
      password: hashedPassword,
    });

    console.log("🎉 Success! God-Mode Admin locked into the database.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedAdmin();