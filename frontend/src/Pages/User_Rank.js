import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styling/ranks.css";

// Rank Rules
const RANK_RULES = [
  { level: 1, requiredUsers: 3, rank: "Bronze" },
  { level: 2, requiredUsers: 9, rank: "Silver" },
  { level: 3, requiredUsers: 27, rank: "Gold" },
  { level: 4, requiredUsers: 81, rank: "Platinum" },
  { level: 5, requiredUsers: 243, rank: "Sapphire" },
  { level: 6, requiredUsers: 729, rank: "Ruby" },
  { level: 7, requiredUsers: 2187, rank: "Emerald" },
  { level: 8, requiredUsers: 6561, rank: "Diamond" },
  { level: 9, requiredUsers: 19683, rank: "Crown" },
  { level: 10, requiredUsers: 59049, rank: "Legendary" },
];

const User_Rank = () => {
  const [userRank, setUserRank] = useState("Starter");

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  useEffect(() => {
    const fetchRank = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        setUserRank(res.data.rank || "Starter");
      } catch (err) {
        console.error("Error fetching user rank:", err);
      }
    };
    fetchRank();
  }, []);

  // Find index of current rank
  const currentIndex = RANK_RULES.findIndex((r) => r.rank === userRank);

  return (
    <section className="ranks-section">
      <div className="ranks_container">
        <h1 className="section-title">Ranks</h1>
        <div className="ranks-grid">
          {RANK_RULES.map((rule, idx) => {
            let statusClass = "";
            let statusText = "";

            if (idx < currentIndex) {
              statusClass = "completed";
              statusText = "Rank Achieved";
            } else if (idx === currentIndex) {
              statusClass = "active";
              statusText = "Your Current Rank ⭐";
              statusClass = "pending";
            } else {
              statusText = "Upcoming ⏳";
            }

            return (
              <div key={rule.rank} className={`rank-card ${statusClass}`}>
                <h2>{rule.rank}</h2>
                <p>Level {rule.level}</p>
                <span className="status-text">{statusText}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default User_Rank;