import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, KeyRound, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { useAuth } from "../../context/AuthContext"; 

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); 
  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // --- STEP 1: SEND CREDENTIALS TO BACKEND ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:5001/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <-- Added here too, just to be safe
        body: JSON.stringify({ 
          email: form.email, 
          password: form.password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Security code sent to your email!");
        setStep(2); 
      } else {
        toast.error(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Unable to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- STEP 2: VERIFY OTP & UPDATE GLOBAL CONTEXT ---
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:5001/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <-- Magic key for cookies
        body: JSON.stringify({ 
          email: form.email,
          code: otp 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Access Granted! Redirecting...");
        
        // No localStorage here at all! Just update Context and Navigate.
        const adminData = { email: form.email, role: "admin" };
        login(adminData); 
        navigate("/admin/dashboard");
      } else {
        toast.error(data.message || "Invalid code. Please check and try again.");
      }
    } catch (error) {
      console.error("OTP Error:", error);
      toast.error("Unable to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col relative overflow-x-hidden">
      <Toaster position="top-center" />

      {/* 1. Header Section */}
      <div className="w-full h-[30vh] md:h-[35vh] bg-gradient-to-r from-[#00A8C5] via-[#47C4B7] to-[#2E8B98] relative flex flex-col items-center justify-center text-white text-center px-4">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <img src="/logo.png" alt="API Logo" className="w-24 md:w-32 mb-4 relative z-10 drop-shadow-md" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight relative z-10">
          {step === 1 ? "Hello 👋 Welcome!" : "Security Verification"}
        </h1>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-8 md:h-16 fill-white">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V46.58C62.47,75.2,143.7,88,214,88,272.2,88,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="flex-1 w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] px-4 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="flex justify-center lg:justify-end order-2 lg:order-1">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 p-6 md:p-10 transition-all duration-500">
              
              {step === 1 ? (
                /* --- LOGIN FORM --- */
                <div className="animate-in fade-in slide-in-from-left-4">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">LogIn</h2>
                    <p className="text-sm text-slate-400 mt-1 font-medium">Please login to admin dashboard</p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 ml-1">Email/Username*</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email" name="email" value={form.email} onChange={handleChange}
                          placeholder="Admin@gmail.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#00A8C5]/20 focus:border-[#00A8C5] transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 ml-1">Password*</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                          placeholder="••••••••••••"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-11 text-sm outline-none focus:ring-2 focus:ring-[#00A8C5]/20 focus:border-[#00A8C5] transition-all"
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit" disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#00A8C5] to-[#47C4B7] text-white font-bold py-3.5 rounded-xl mt-4 shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? "Checking..." : "Login"} <ArrowRight className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              ) : (
                /* --- OTP FORM --- */
                <div className="animate-in fade-in slide-in-from-right-4">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-[#00A8C5] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00A8C5]/20">
                      <KeyRound className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Verify OTP</h2>
                    <p className="text-sm text-slate-400 mt-1 font-medium px-4">
                      Enter the 6-digit code sent to <br/><span className="text-[#00A8C5]">{form.email}</span>
                    </p>
                  </div>

                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <input
                      type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)}
                      placeholder="0 0 0 0 0 0"
                      className="w-full text-center tracking-[0.5em] text-xl font-bold rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 outline-none focus:border-[#00A8C5] focus:bg-white focus:ring-4 focus:ring-[#00A8C5]/10 transition-all"
                      required
                    />

                    <button
                      type="submit" disabled={isLoading}
                      className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-[#00A8C5] transition-all duration-300"
                    >
                      {isLoading ? "Verifying..." : "Confirm & Enter"}
                    </button>
                  </form>

                  <button 
                    onClick={() => setStep(1)}
                    className="mt-6 flex items-center justify-center gap-2 w-full text-sm font-bold text-slate-400 hover:text-[#00A8C5] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Edit Email / Back
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center lg:justify-start order-1 lg:order-2 animate-float">
            <img src="/visual-data.png" alt="Visual Data" className="w-64 sm:w-80 lg:w-[450px] drop-shadow-2xl object-contain" />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 5s ease-in-out infinite; }
      `}} />
    </div>
  );
};

export default LoginPage;