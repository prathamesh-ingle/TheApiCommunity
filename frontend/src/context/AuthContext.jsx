import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check SESSION storage on load
  useEffect(() => {
    const savedUser = sessionStorage.getItem("adminUser"); 
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    // 2. Save to SESSION storage (vaporizes when tab closes)
    sessionStorage.setItem("adminUser", JSON.stringify(userData)); 
  };

const logout = async () => {
    try {
      // 1. Tell the backend to kill the cookie
      await fetch(`${API_BASE_URL}/admin/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🚨 REQUIRED: Tells browser to accept the "delete cookie" command
      });
    } catch (error) {
      console.error("Logout API failed:", error);
    }

    // 2. Clear the frontend memory
    setUser(null);
    sessionStorage.removeItem("adminUser"); 
    
    // 3. Kick them to login
    window.location.href = "/admin/login"; 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);