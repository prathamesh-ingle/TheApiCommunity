import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// To this:
import adminRoutes from './src/routes/admin.routes.js';
import connectDB from './lib/db.js';
const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use("/api/admin",adminRoutes);

const PORT=process.env.PORT || 5001;

const startServer = async ()=>{
    try {
        await connectDB();
       app.listen(PORT,()=>{
        console.log(`✅ Server running on port ${PORT}`);
       });
    }catch(error){
        console.error("❌ Failed to start server :",error.message);
    }
};

startServer();