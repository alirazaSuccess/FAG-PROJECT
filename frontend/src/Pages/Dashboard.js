import React, { useState, useEffect } from 'react';
import "../styling/Dashboard.css";
import { Link } from 'react-router-dom';
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [rank, setRank] = useState("STARTER");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setError("");
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        });

        const userData = res.data || {};
        setUser(userData);

        const referralHistory = userData.referralHistory || [];
        setReferrals(referralHistory);

        // Commission (excluding daily bonus)
        const profitSum = referralHistory
          .filter(r => r.name !== "dailyProfit")
          .reduce((sum, r) => sum + Number(r.profit || 0), 0);
        setTotalProfit(profitSum);

        // ✅ Use backend dailyProfit directly instead of recalculating
        setDailyProfit(Number(userData.dailyProfit || 0));

        setRank(userData.rank || "STARTER");
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load dashboard");
      }
    };

    fetchUser();

    // optional polling
    const interval = setInterval(fetchUser, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dash_container">
      <div className="topbar">
        <h1 style={{ color: "white" }}>Perfumes / Watches — Dashboard</h1>
        <Link to={"/payment"}>
          <button className="tab withdraw">DEPOSIT</button>
        </Link>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: 8, borderRadius: 8, marginTop: 8 }}>
          {error}
        </div>
      )}

      <section className="cards" aria-label="Summary statistics">
        <article className="card" aria-labelledby="profit">
          <h4 id="profit">Daily Profit</h4>
          <div className="value primary">${Number(dailyProfit || 0).toFixed(2)}</div>
        </article>

        <article className="card" aria-labelledby="commission">
          <h4 id="commission">Commission</h4>
          <div className="value success">${Number(totalProfit || 0).toFixed(2)}</div>
        </article>

        <article className="card" aria-labelledby="earnings">
          <h4 id="earnings">Total Earnings</h4>
          <div className="value warning">${Number((totalProfit || 0) + (dailyProfit || 0)).toFixed(2)}</div>
        </article>

        <article className="card" aria-labelledby="withdraw">
          <h4 id="withdraw">Total Withdraw</h4>
          <div className="value danger">$0</div>
        </article>

        <article className="card card--wide" aria-labelledby="package">
          <h4 id="package">Package</h4>
          <div className="value" style={{ fontSize: "18px", fontWeight: "800", color: "#1f2937" }}>
            <a href="#" style={{ textDecoration: "none", color: "#2563eb" }}>
              {user ? `Perfume Package : ${Number(user.balance || 0)} $` : "Loading..."}
            </a>
          </div>
        </article>

        <article className="card card--wide" aria-labelledby="rank">
          <h4 id="rank">Rank</h4>
          <div className="value" style={{ color: "#b45309" }}>{rank}</div>
        </article>
      </section>

      <nav className="tabs" aria-label="Primary actions">
        <div className="tab referrals" role="button" tabIndex="0">Referrals</div>
        <Link to={'/user-dashboard/withdraw'}>
          <div className="tab withdraw" role="button" tabIndex="0">Withdraw Funds</div>
        </Link>
      </nav>
    </div>
  );
};

export default Dashboard;