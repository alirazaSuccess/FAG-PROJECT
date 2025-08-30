/* eslint-disable react/jsx-pascal-case */
import React, { useState } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import "../styling/admindasboard.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupIcon from "@mui/icons-material/Group";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

// Import Subpages
import AdminHome from "./AdminHome";
import AdminUsers from "./AdminUsers";
import AdminProfile from "./AdminProfile";
import Admin_Request from "./Admin_Request";

export default function AdminDashboard() {
  const [navClosed, setNavClosed] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setNavClosed((prev) => !prev);
  };

  const handleLogout = () => {
    sessionStorage.setItem("isAdminLoggedIn", "false"); // or removeItem if preferred
    navigate("/admin-login", { replace: true });
    sessionStorage.clear();
  };

  return (
    <>
      <header>
        <div className="logosec">
          <svg
            className="icn menuicn"
            id="menuicn"
            onClick={toggleMenu}
            width="50"
            height="50"
            viewBox="0 0 128 128"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Drawer with left chevron"
          >
            <rect
              x="6"
              y="6"
              width="116"
              height="116"
              rx="18"
              ry="18"
              fill="none"
              stroke="#000"
              strokeWidth="12"
            />
            <line
              x1="48"
              y1="18"
              x2="48"
              y2="110"
              stroke="#000"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <polyline
              points="40,80 24,64 40,48"
              fill="none"
              stroke="#000"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="">
          <div className="admin_logo">FAG ADMIN</div>
        </div>
        <div className="message">
          <div className="dp">
            <AccountCircleIcon
              className="dpicn"
              sx={{ width: "40px", height: "40px" }}
            />
          </div>
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar */}
        <div className={`navcontainer ${navClosed ? "navclose" : ""}`}>
          <nav className="nav">
            <div className="nav-upper-options">
              <Link to="" className="nav-option option1">
                <GroupIcon className="nav-img" />
                <h3>Dashboard</h3>
              </Link>

              <Link to="users" className="nav-option option2">
                <GroupIcon className="nav-img" />
                <h3>Users</h3>
              </Link>

              <Link to="Admin_Request" className="nav-option option3">
                <h3>Withdraw Request</h3>
              </Link>

              <Link to="profile" className="nav-option option3">
                <AdminPanelSettingsIcon className="nav-img" />
                <h3>Admin Profile</h3>
              </Link>

              <div className="nav-option logout" onClick={handleLogout}>
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/7.png"
                  className="nav-img"
                  alt="logout"
                />
                <h3>Logout</h3>
              </div>
            </div>
          </nav>
        </div>

        {/* Content Area */}
        <div style={{ width: "100%", padding: '30px' }}>
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="Admin_Request" element={<Admin_Request />} />
            <Route path="profile" element={<AdminProfile />} />
          </Routes>
        </div>
      </div>
    </>
  );
}