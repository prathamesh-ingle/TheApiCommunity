import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00A8C5]"></div>
      </div>
    );
  }

  // STRICT CHECK: Must exist AND must have the admin role
  if (!user || user.role !== "admin") {
    console.warn("Blocked: Unauthorized access attempt to Admin area.");
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;