import express from "express";
import Admin from "../models/AdminModel.js";
import Otp from "../models/OtpModel.js";
import { sendOtpEmail } from "../utils/email.utils.js";
import jwt from "jsonwebtoken";

//GENERATE ADMIN TOKEN 
const generateAdminToken=(id,email)=>{
    return jwt.sign({id,email},
        process.env.JWT_SECRET,{
            expiresIn:"1d"
        }
    );
}

const sendAdminCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000, // 1 Day in milliseconds
  });
};


//OTP GENERATION FUNCION
const generateOtpCode=()=>{
    return Math.floor(100000+Math.random()*900000).toString();
}

//ADMIN LOGIN
export const AdminLogin = async (req,res)=>{
    try{
        const{email,password}=req.body;
       //EMAIL AND PASSWORD SHOULD NOT BE EMPTY
        if(!email || !password){
            return res.status(400).json({error:"Email and password are required."});
        }
        //CHECK WHETER THIS ADMIN EXIST OR NOT
        const admin=await Admin.findOne({email});
        
        //CHECK PASSWORD AND SEND VERIFICATION OTP
        if(admin && (await admin.matchPassword(password))){
         const code=generateOtpCode();
         const expiresAt=new Date(Date.now()+5*60*1000);//EXPIRES WITHIN 5 MINUTES
         
         await Otp.deleteMany({email,purpose:"login",verified:false});//DELETE OLD OTPs

         await Otp.create({email,code,purpose:"login",expiresAt});//CREATE NEW ONE

         await sendOtpEmail({to:email,code});//SEND OTP ../utils/email.utils"

         console.log(`Admin password verified for ${email}. OTP Sent`)
        return res.status(200).json({
        message: "Password verified. OTP sent to admin email.",
        email: admin.email,
      });
    }else{
         console.log("⚠️ Failed Admin login attempt detected.");
      return res.status(401).json({ error: "Invalid Admin Credentials." });
    }
}catch(error){
    console.error("Admin Login Error:", error);
    res.status(500).json({ error: "Internal Server Error." }); 
}};

//VERIFY OTP 

export const verifyAdminLogin=async (req,res)=>{
    try{
        const {email,code}=req.body;

        if (!email || !code) {
      return res
        .status(400)
        .json({ error: "Email and OTP code are required." });
    }

    //verify OTP
    const otpDoc=await Otp.findOne({
        email,code,purpose:"login",verified:false
    });
    if(!otpDoc){
      return res.status(400).json({ error: "Invalid or expired OTP." });   
    }
    if(otpDoc.expiresAt<new Date()){
         return res.status(400).json({ error: "OTP has expired." });
    }
    otpDoc.verified=true;
    await otpDoc.save();

    //ISSUE ADMIN TOKEN
    const admin = await Admin.findOne({ email });
    const token = generateAdminToken(admin._id, admin.email);
    sendAdminCookie(res, token);

      console.log(`🚨 GOD-MODE ACTIVATED: ${admin.email} passed 2FA.`);

      res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      message: "God-Mode Activated. Welcome to PayNidhi Command Center.",
    });
    }catch(error){
      console.error("Admin OTP Verification Error:", error);
    res.status(500).json({ error: "Internal Server Error." });  
    }
};

