import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token =
    sessionStorage.getItem("token") || sessionStorage.getItem("adminToken");
  const userRole = sessionStorage.getItem("role");

  // ✅ Agar login hi nahi hai
  if (!token) {
    return <Navigate to="/404" />;
  }

  // ✅ Agar role match nahi karta
  if (role && userRole !== role) {
    return <Navigate to="/404" />;
  }

  return children;
}