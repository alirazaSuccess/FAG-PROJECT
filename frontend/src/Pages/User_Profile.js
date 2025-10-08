import React, { useEffect, useState } from "react";
import "../styling/UserProfile.css";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

const User_Profile = () => {
  const [user, setUser] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }

        const response = await axios.get(`${API_BASE}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <CircularProgress style={{display: "flex", justifyContent: "center", alignItems: "center",}} />
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>{user.username}</h1>
      </div>

      <table className="profile-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Email</td>
            <td>{user.email}</td>
          </tr>
          <tr>
            <td>Number</td>
            <td>{user.number}</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>{user.address}</td>
          </tr>
          <tr>
            <td>City</td>
            <td>{user.city}</td>
          </tr>
          <tr>
            <td>Country</td>
            <td>{user.country}</td>
          </tr>
          <tr>
            <td>Referral Code</td>
            <td>{user.refCode}</td>
          </tr>
          <tr>
            <td>Rank</td>
            <td>{user.rank}</td>
          </tr>
          <tr>
            <td>Current Level</td>
            <td>
              {user.level > 0 ? (
                <span
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    borderRadius: "10px",
                    padding: "5px 10px",
                    cursor: "default",
                  }}
                >
                  Level {user.level}
                </span>
              ) : (
                "LEVEL 0"
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default User_Profile;