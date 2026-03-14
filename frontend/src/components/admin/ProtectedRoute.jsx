import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkAuth } from "../../api/adminApi"; // Adjust path if necessary

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Axios automatically includes the HttpOnly cookie in this request
        await checkAuth(); 
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    verifyToken();
  }, []);

  // Show a loading spinner while waiting for backend verification
  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A7294]"></div>
      </div>
    );
  }

  // If authenticated, render the children routes. If not, redirect to login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;