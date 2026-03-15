// backend/server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import adminRoutes from "./src/routes/admin.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import connectDB from "./lib/db.js";

const app = express();

// Middleware
app.use(cors({
  // Automatically uses your Vercel URL in production, or localhost when testing locally
  origin: process.env.FRONTEND_URL || "http://localhost:5173", 
  credentials: true, // 🚨 REQUIRED for the backend to send/receive HttpOnly cookies
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// 🔥 THE MAGIC ERROR HANDLER 🔥
// This intercepts crashes and forces Express to send JSON instead of HTML
app.use((err, req, res, next) => {
    console.error("🚨 BACKEND CRASH:", err);
    
    // Check if it's a file upload error
    if (err.name === 'MulterError') {
        return res.status(400).json({ success: false, message: `Multer Error: ${err.message}`, field: err.field });
    }

    // Default to 500 Server Error
    res.status(500).json({ 
        success: false, 
        message: "Server encountered an error before reaching the controller", 
        error: err.message || "Unknown Error"
    });
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server :", error.message);
  }
};

startServer();