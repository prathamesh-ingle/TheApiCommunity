import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkAuth } from "../../api/adminApi";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Axios automatically includes the HttpOnly cookie in this request
        await checkAuth(); 
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication failed:", error);
        setIsAuthenticated(false);
      }
    };
    
    verifyToken();
  }, []);

  // 1. Show a loading state while waiting for backend verification
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#0A7294]/20 border-t-[#0A7294] rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Verifying Session...
          </p>
        </div>
      </div>
    );
  }

  // 2. If authenticated, render the children routes. If not, redirect to login securely.
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;