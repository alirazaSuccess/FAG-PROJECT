import React, { useState, useEffect } from 'react';
import "../styling/Dashboard.css";
import { Link } from 'react-router-dom';
import axios from "axios";


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [totalProfit, setTotalProfit] = useState(0);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [rank, setRank] = useState("STARTER");
  const [error, setError] = useState("");
  const [binanceUSDT, setBinanceUSDT] = useState(null); // <- Binance balance
  const [refCode, setRefCode] = useState("");
  const [copied, setCopied] = useState(false);

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
  // ✅ handleCopy outside useEffect
  const handleCopy = async (e) => {
    e?.stopPropagation?.(); // don't trigger parent click
    if (!refCode) return;

    // copy referral link (or just the code if you prefer)
    const text = `${window.location.origin}/register?ref=${refCode}`;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setError("");
        const res = await axios.get(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        });

        const userData = res.data || {};
        setUser(userData);
        setRefCode(userData.refCode);

        const referralHistory = userData.referralHistory || [];
        const profitSum = referralHistory
          .filter(r => r.name !== "dailyProfit")
          .reduce((sum, r) => sum + Number(r.profit || 0), 0);

        setTotalProfit(profitSum);
        setDailyProfit(Number(userData.dailyProfit || 0));
        setRank(userData.rank || "STARTER");
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load dashboard");
      }
    };

    const fetchBinance = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/public/binance/usdt`);
        setBinanceUSDT(Number(data?.total || 0));
      } catch (e) {
        setBinanceUSDT(0);
      }
    };

    fetchUser();
    fetchBinance();

    // optional polling for user data
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
          <div className="value warning">
            ${Number((totalProfit || 0) + (dailyProfit || 0)).toFixed(2)}
          </div>
        </article>

        <article className="card" aria-labelledby="withdraw">
          <h4 id="withdraw">Withdraw (Binance USDT)</h4>
          <div className="value danger">
            {binanceUSDT === null ? "—" : `$${binanceUSDT.toFixed(2)}`}
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            Spot + Funding total
          </div>
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
        <div
          className="tab referrals"
          role="button"
          tabIndex="0"
          style={{ display: "flex", alignItems: "center", gap: 8, width: "40vw" }}
        >
          <button
            onClick={handleCopy}
            title="Copy referral code"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: 8,
              border: "none",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
            </svg>
          </button>
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {refCode}
          </span>
          {copied && <span style={{ marginLeft: 6, fontSize: 12, color: "#e5e7eb" }}>Copied!</span>}
        </div>

        <Link to={'/user-dashboard/withdraw'}>
          <div className="tab withdraw" role="button" tabIndex="0" style={{width: "40vw"}}>Withdraw Funds</div>
        </Link>
      </nav>
    </div>
  );
};

export default Dashboard;