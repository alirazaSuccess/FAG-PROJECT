/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import "../styling/admindasboard.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupIcon from "@mui/icons-material/Group";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import PaidIcon from "@mui/icons-material/Paid";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PeopleIcon from "@mui/icons-material/People";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { CircularProgress } from "@mui/material";
import axios from "axios";

// Import Subpages
import User_Profile from "./User_Profile";
import Rank from "../Pages/User_Rank";
import Profit from "../Pages/User_Profit";
import Bonus from "../Pages/User_Bonus";
import Withdraw from "../Pages/User_Withdraw";
import Team from "./Team";
import Dashboard from "./Dashboard";

export default function UserDashboard() {
  const [navClosed, setNavClosed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isUserLoggedIn") === "true";
    const token = sessionStorage.getItem("token");

    const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

    if (!isLoggedIn || !token) {
      return navigate("/register", { replace: true });
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCurrentUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        sessionStorage.removeItem("token");
        sessionStorage.setItem("isUserLoggedIn", "false");
        navigate("/register", { replace: true });
      }
    };

    fetchUser();
  }, [navigate]);

  const toggleMenu = () => setNavClosed((prev) => !prev);

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
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isUserLoggedIn");
    sessionStorage.setItem("isPaymentDone", "false");
    sessionStorage.removeItem("isPaymentDone");
    sessionStorage.removeItem("role");
    setNavClosed(true); // also close on logout
    navigate("/", { replace: true });
  };

  if (!currentUser) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header>
        <div className="logosec">
          <svg
            className="icn menuicn"
            onClick={toggleMenu}
            width="50"
            height="50"
            viewBox="0 0 128 128"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="6" y="6" width="116" height="116" rx="18" ry="18" fill="none" stroke="#000" strokeWidth="12" />
            <line x1="48" y1="18" x2="48" y2="110" stroke="#000" strokeWidth="12" strokeLinecap="round" />
            <polyline points="40,80 24,64 40,48" fill="none" stroke="#000" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="admin_logo">{currentUser.username} Dashboard</div>
        <div className="message">
          <div className="dp">
            <AccountCircleIcon sx={{ width: "40px", height: "40px" }} />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="main-container">
        <div className={`navcontainer ${navClosed ? "navclose" : ""}`}>
          <nav className="nav">
            <div className="nav-upper-options">
              <Link to="/user-dashboard/dashboard" className="nav-option option1" onClick={handleNavLinkClick}>
                <GroupIcon className="nav-img" />
                <h4>Dashboard</h4>
              </Link>
              <Link to="/user-dashboard/profile" className="nav-option option2" onClick={handleNavLinkClick}>
                <GroupIcon className="nav-img" />
                <h4>Profile</h4>
              </Link>
              <Link to="/user-dashboard/rank" className="nav-option option2" onClick={handleNavLinkClick}>
                <GroupIcon className="nav-img" />
                <h4>Rank</h4>
              </Link>
              <Link to="/user-dashboard/profit" className="nav-option option3" onClick={handleNavLinkClick}>
                <PaidIcon className="nav-img" />
                <h4>Commission</h4>
              </Link>
              <Link to="/user-dashboard/bonus" className="nav-option option4" onClick={handleNavLinkClick}>
                <MonetizationOnIcon className="nav-img" />
                <h4>Bonus</h4>
              </Link>
              <Link to="/user-dashboard/team" className="nav-option option5" onClick={handleNavLinkClick}>
                <PeopleIcon className="nav-img" />
                <h4>Referrals</h4>
              </Link>
              <Link to="/user-dashboard/withdraw" className="nav-option option6" onClick={handleNavLinkClick}>
                <EmojiPeopleIcon className="nav-img" />
                <h4>Withdraw</h4>
              </Link>

              <div className="nav-option logout" onClick={handleLogout}>
                <LogoutOutlinedIcon className="nav-img" />
                <h4>Logout</h4>
              </div>
            </div>
          </nav>
        </div>

        {/* Content Area */}
        <div className="content-area">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<User_Profile />} />
            <Route path="rank" element={<Rank />} />
            <Route path="profit" element={<Profit />} />
            <Route path="bonus" element={<Bonus />} />
            <Route path="team" element={<Team currentUser={currentUser} />} />
            <Route path="withdraw" element={<Withdraw />} />
          </Routes>
        </div>
      </div>
    </>
  );
}