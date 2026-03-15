// frontend/src/pages/admin/LoginPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, KeyRound, ArrowLeft, RefreshCw } from "lucide-react";
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
  
  // States for Resend Logic
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const otpRefs = useRef([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  // Timer Effect
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // --- STEP 1: SEND CREDENTIALS TO BACKEND ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Security code sent to your email!");
        setTimer(60); // Reset timer on fresh login
        setOtp(""); // Clear any old OTP
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

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setIsResending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("A new security code has been sent!");
        setTimer(60);
        setOtp(""); // Clear inputs
        if (otpRefs.current[0]) otpRefs.current[0].focus();
      } else {
        toast.error(data.message || "Failed to resend code.");
      }
    } catch (error) {
      console.error("Resend Error:", error);
      toast.error("Unable to connect to the server.");
    } finally {
      setIsResending(false);
    }
  };

  // Extract verification logic into a reusable function for auto-submit
  const executeOtpVerification = async (codeToVerify) => {
    if (codeToVerify.length < 6) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: form.email, code: codeToVerify }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Access Granted! Redirecting...");
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

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }
    executeOtpVerification(otp);
  };

  // --- Smart OTP Box Handlers ---
  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return; // Allow numbers only

    let newOtp = otp.split("");
    newOtp[index] = value.substring(value.length - 1); // Get last typed character
    const updatedOtp = newOtp.join("");
    setOtp(updatedOtp);

    // Auto-submit if complete, else focus next
    if (updatedOtp.length === 6) {
      otpRefs.current[5].blur(); // hide keyboard
      executeOtpVerification(updatedOtp);
    } else if (value && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Auto-focus previous input on backspace if current is empty
    if (e.key === "Backspace" && !otp[index] && index > 0 && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;
    
    setOtp(pastedData);
    
    if (pastedData.length === 6) {
      otpRefs.current[5].blur();
      executeOtpVerification(pastedData);
    } else {
      const focusIndex = Math.min(pastedData.length, 5);
      if (otpRefs.current[focusIndex]) {
        otpRefs.current[focusIndex].focus();
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col relative overflow-x-hidden selection:bg-[#00A8C5] selection:text-white">
      <Toaster position="top-center" toastOptions={{ duration: 4000, style: { borderRadius: '16px', fontWeight: '500' } }} />

      {/* 1. Header Section */}
      <div className="w-full h-[25vh] md:h-[28vh] min-h-[260px] bg-gradient-to-r from-[#00A8C5] via-[#47C4B7] to-[#2E8B98] bg-[length:200%_200%] animate-gradient relative flex flex-col items-center justify-center text-white text-center px-4 shadow-inner">
        <div className="absolute inset-0 opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
        
        <div className="relative z-10 flex flex-col items-center animate-fade-in-up pb-8 md:pb-6">
          <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-[1.25rem] mb-3 shadow-xl border border-white/20">
            <img src="/logo.png" alt="API Logo" className="w-16 md:w-20 drop-shadow-lg transition-transform duration-500 hover:scale-105" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-md">
            {step === 1 ? "Hello 👋 Welcome!" : "Security Verification"}
          </h1>
          <p className="mt-1.5 text-white/90 text-sm md:text-base font-medium max-w-sm drop-shadow-sm">
            {step === 1 ? "Sign in to access the API control panel" : "Protecting your administrative access"}
          </p>
        </div>
        
        {/* SVG Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180 drop-shadow-sm">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-10 md:h-12 fill-slate-50">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
          </svg>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="flex-1 w-full bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] px-4 py-6 lg:py-10 flex items-center justify-center">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          
          {/* Form Column */}
          <div className="flex justify-center lg:justify-end order-2 lg:order-1 z-10 relative w-full">
            {/* Softer, more diffuse glow behind the card */}
            <div className="absolute -inset-3 bg-gradient-to-r from-[#00A8C5]/20 to-[#47C4B7]/20 rounded-[3rem] blur-2xl animate-pulse"></div>
            
            {/* Softer Card Form styling (rounded-[2.5rem], softer shadow, frosted border) */}
            <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-white/60 p-8 md:p-10 transition-all duration-500 relative animate-fade-in-up delay-100 mx-auto">
              
              {step === 1 ? (
                /* --- LOGIN FORM --- */
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-slate-800 rounded-[1.25rem] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-slate-800/10 transform hover:rotate-6 transition-transform duration-300">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Log In</h2>
                    <p className="text-sm text-slate-500 mt-1.5 font-medium">Enter your credentials to continue</p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Email/Username</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#00A8C5] transition-colors duration-300" />
                        {/* Softer Inputs */}
                        <input
                          type="email" name="email" value={form.email} onChange={handleChange}
                          placeholder="admin@example.com"
                          className="w-full bg-slate-50/50 border border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] rounded-2xl py-3.5 pl-11 pr-4 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-[#00A8C5]/10 focus:border-[#00A8C5]/30 transition-all duration-300"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#00A8C5] transition-colors duration-300" />
                        <input
                          type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                          placeholder="••••••••••••"
                          className="w-full bg-slate-50/50 border border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] rounded-2xl py-3.5 pl-11 pr-11 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-[#00A8C5]/10 focus:border-[#00A8C5]/30 transition-all duration-300"
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-xl hover:bg-slate-100/50">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit" disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#00A8C5] to-[#47C4B7] text-white font-bold py-3.5 rounded-2xl mt-6 shadow-lg shadow-[#00A8C5]/20 hover:shadow-[#00A8C5]/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden relative group"
                    >
                      <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                      <span className="relative flex items-center gap-2 text-sm">
                        {isLoading ? "Authenticating..." : "Sign In to Dashboard"} <ArrowRight className="w-4 h-4" />
                      </span>
                    </button>
                  </form>
                </div>
              ) : (
                /* --- OTP FORM --- */
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#00A8C5] to-[#47C4B7] rounded-[1.25rem] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#00A8C5]/20 transform hover:scale-105 transition-transform duration-300">
                      <KeyRound className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Verify Identity</h2>
                    <p className="text-sm text-slate-500 mt-2 font-medium px-4 leading-relaxed">
                      We sent a 6-digit secure code to <br/><span className="text-[#0A7294] font-bold">{form.email}</span>
                    </p>
                  </div>

                  <form onSubmit={handleOtpSubmit} className="space-y-7">
                    {/* 6 Square OTP Boxes - Softer design */}
                    <div className="flex justify-between gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength="1"
                          value={otp[index] || ""}
                          onChange={(e) => handleOtpChange(index, e)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-black rounded-[1rem] border border-slate-100 bg-slate-50/80 outline-none focus:border-[#00A8C5]/40 focus:bg-white focus:ring-4 focus:ring-[#00A8C5]/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] transition-all duration-300"
                        />
                      ))}
                    </div>

                    {/* Resend OTP Timer & Button */}
                    <div className="text-center mt-2 mb-2">
                      <p className="text-[13px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
                        Didn't receive the code?
                        {timer > 0 ? (
                          <span className="text-[#47C4B7] font-bold">Resend in {timer}s</span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={isResending}
                            className="text-[#0A7294] font-bold hover:underline transition-all flex items-center gap-1"
                          >
                            {isResending ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : null}
                            {isResending ? "Sending..." : "Resend OTP"}
                          </button>
                        )}
                      </p>
                    </div>

                    <button
                      type="submit" disabled={isLoading || otp.length < 6}
                      className="w-full bg-slate-800 text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-slate-800/10 hover:bg-[#00A8C5] hover:shadow-[#00A8C5]/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 text-sm disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {isLoading ? "Verifying Token..." : "Confirm & Access"}
                    </button>
                  </form>

                  <button 
                    onClick={() => setStep(1)}
                    className="mt-6 flex items-center justify-center gap-2 w-full text-[13px] font-bold text-slate-400 hover:text-[#0A7294] transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" /> 
                    Use a different account
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center lg:justify-start order-1 lg:order-2 animate-float perspective-1000">
            <img 
              src="/visual-data.png" 
              alt="Visual Data" 
              className="w-56 sm:w-72 lg:w-[420px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.08)] object-contain transition-transform duration-700 hover:scale-105 hover:rotate-1" 
            />
          </div>
        </div>
      </div>

      {/* Embedded Styles for the Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float { 
          0%, 100% { transform: translateY(0px); } 
          50% { transform: translateY(-12px); } 
        }
        .animate-float { 
          animation: float 6s ease-in-out infinite; 
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 8s ease infinite;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
      `}} />
    </div>
  );
};

export default LoginPage;