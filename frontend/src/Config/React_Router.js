/* eslint-disable react/jsx-pascal-case */
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Home from "../Pages/Home";
import About from "../Pages/About";
import Navbar from "../Components/Navbar";
import Contact from "../Pages/Contact";
import Login_Signup from "../Pages/Login_Signup";
import AdminDashboard from "../Pages/AdminDashboard";
import UserDashboard from "../Pages/UserDashboard";
import Adminlogin from "../Pages/Adminlogin";
import AdminSignup from "../Pages/AdminSignup";
import NotFound from "../Pages/NotFound";

// Admin subpages
import AdminUsers from "../Pages/AdminUsers";
import AdminProfile from "../Pages/AdminProfile";
import PaymentStep from "../Components/Payment";

// User subpages
import Dashboard from "../Pages/Dashboard";
import User_Profile from "../Pages/User_Profile";
import Rank from "../Pages/User_Rank";
import Profit from "../Pages/User_Profit";
import Bonus from "../Pages/User_Bonus";
import Withdraw from "../Pages/User_Withdraw";
import Team from "../Pages/Team";

// ✅ Import ProtectedRoute
import ProtectedRoute from "../Components/ProtectedRoute";
import Admin_Request from "../Pages/Admin_Request";

function PublicRoute({ children, role }) {
  const isAdminLoggedIn = sessionStorage.getItem("isAdminLoggedIn") === "true";
  const isUserLoggedIn = sessionStorage.getItem("isUserLoggedIn") === "true";

  // Agar login hai to redirect kare
  if (isAdminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }
  if (isUserLoggedIn) {
    return <Navigate to="/user-dashboard/dashboard" replace />;
  }

  // Agar login nahi hai to normal page render kare
  return children;
}


// Layout to conditionally show Navbar
function AppLayout({ children }) {
  const location = useLocation();

  const shouldHideNavbar =
    location.pathname === "/admin-login" ||
    location.pathname === "/admin-signup" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/user-dashboard") ||
    location.pathname.startsWith("/payment");

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
}

export default function React_Router() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          {/* Public Routes (Agar login hai to redirect karega) */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PublicRoute>
                <About />
              </PublicRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicRoute>
                <Contact />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Login_Signup />
              </PublicRoute>
            }
          />

          {/* Admin Signup & Login */}
          <Route
            path="/admin-signup"
            element={
              <PublicRoute>
                <AdminSignup />
              </PublicRoute>
            }
          />
          <Route
            path="/admin-login"
            element={
              <PublicRoute>
                <Adminlogin />
              </PublicRoute>
            }
          />

          {/* Payment Step (isko Public rakha) */}
          <Route path="/payment" element={<PaymentStep />} />

          {/* Admin Dashboard & subpages (Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="users" element={<AdminUsers />} />
            <Route path="Admin_Request" element={<Admin_Request />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* User Dashboard & subpages (Protected) */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<User_Profile />} />
            <Route path="rank" element={<Rank />} />
            <Route path="profit" element={<Profit />} />
            <Route path="bonus" element={<Bonus />} />
            <Route path="team" element={<Team />} />
            <Route path="withdraw" element={<Withdraw />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}