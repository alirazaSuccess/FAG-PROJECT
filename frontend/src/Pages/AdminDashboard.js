/* eslint-disable react/jsx-pascal-case */
import React, { useState } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import "../styling/admindasboard.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupIcon from "@mui/icons-material/Group";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import LocalMallIcon from '@mui/icons-material/LocalMall';


// Import Subpages
import AdminHome from "./AdminHome";
import AdminUsers from "./AdminUsers";
import Admin_Request from "./Admin_Request";
import Admin_ProductRequests from "./Admin_ProductRequests";

export default function AdminDashboard() {
  const [navClosed, setNavClosed] = useState(false);
  const navigate = useNavigate();
    const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  const toggleMenu = () => {
    setNavClosed((prev) => !prev);
  };
  // Close the nav only on mobile after clicking a link.
  // On desktop it stays open (sticks).
  const handleNavLinkClick = () => {
    if (isMobile()) {
      setNavClosed((prev) => !prev)   // collapse after navigate on phones/tablets
    } else {
      setNavClosed(false);  // keep it open on desktop
    }
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
          <div className="admin_logo">FAG WORLD ADMIN</div>
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
              <Link to="" className="nav-option option1" onClick={handleNavLinkClick}>
                <GroupIcon className="nav-img" />
                <h4>Dashboard</h4>
              </Link>

              <Link to="users" className="nav-option option2" onClick={handleNavLinkClick}>
                <GroupIcon className="nav-img" />
                <h4>Users</h4>
              </Link>

              <Link to="Admin_Request" className="nav-option option3" onClick={handleNavLinkClick}>
                <EmojiPeopleIcon className="nav-img" />
                <h4>Withdraw</h4>
              </Link>
              <Link to="/admin/product-requests" className="nav-option" onClick={handleNavLinkClick}>
                <LocalMallIcon />
                <h4>Product</h4>
              </Link>

              <div className="nav-option logout" onClick={handleLogout}>
                <LogoutOutlinedIcon className="nav-img" />
                <h4>Logout</h4>
              </div>
            </div>
          </nav>
        </div>

        {/* Content Area */}
        <div style={{ width: "80%", padding: '30px' }}>
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="Admin_Request" element={<Admin_Request />} />
            <Route path="product-requests" element={<Admin_ProductRequests />} />
          </Routes>
        </div>
      </div>
    </>
  );
}