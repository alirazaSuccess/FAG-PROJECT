import React, { useState, useEffect } from 'react';
import "../styling/Dashboard.css";
import { Link } from 'react-router-dom';
import axios from "axios";
import { CircularProgress } from '@mui/material';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [totalProfit, setTotalProfit] = useState(0);   // <- referral commission only
  const [dailyProfit, setDailyProfit] = useState(0);   // <- daily incentive
  const [rank, setRank] = useState("STARTER");
  const [error, setError] = useState("");
  const [refCode, setRefCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Withdrawals
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [pendingWithdraw, setPendingWithdraw] = useState(0);

  // ✅ Claim gating + status
  const [eligible, setEligible] = useState(false);           // balance >= 50
  const [claimStatus, setClaimStatus] = useState("none");    // none | pending | approved | rejected

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const handleCopy = async (e) => {
    e?.stopPropagation?.();
    if (!refCode) return;

    const text = `${window.location.origin}/register?ref=${refCode}`;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
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

        // ✅ eligibility by balance
        setEligible(Number(userData.balance || 0) >= 50);

        // ---------- FIX STARTS HERE ----------
        // We only want referral commission here (exclude daily bonus lines).
        // Handle both current "Daily Bonus" and any legacy "dailyProfit" markers.
        const referralHistory = Array.isArray(userData.referralHistory) ? userData.referralHistory : [];
        const isDailyLine = (r) => {
          const n = String(r?.name || "").toLowerCase().trim();
          // exclude “Daily Bonus”, legacy “dailyProfit”, and common variants
          return n === "daily bonus" || n === "dailyprofit" || n === "daily_profit" || n === "daily";
        };

        // ---------- FIX ENDS HERE ----------

        setTotalProfit(userData.bonusEarned);                     // Commission card
        setDailyProfit(Number(userData.dailyProfit || 0));      // Daily Incentive card
        setRank(userData.rank || "STARTER");
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load dashboard");
      }
    };

    const fetchWithdrawals = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${API_BASE}/api/users/withdrawals/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const withdrawals = res.data?.withdrawals || [];
        const paid = withdrawals
          .filter(w => (w.status || "").toLowerCase() === "paid")
          .reduce((sum, w) => sum + Number(w.amount || 0), 0);

        const pending = withdrawals
          .filter(w => ["pending", "approved"].includes((w.status || "").toLowerCase()))
          .reduce((sum, w) => sum + Number(w.amount || 0), 0);

        setTotalWithdrawn(paid);
        setPendingWithdraw(pending);
      } catch (err) {
        console.error("Error fetching withdrawals:", err);
      }
    };

    // ✅ latest claim status
    const fetchClaims = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${API_BASE}/api/users/claims/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const claims = res.data?.claims || [];
        if (claims.length) {
          claims.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setClaimStatus((claims[0].status || "none").toLowerCase());
        } else {
          setClaimStatus("none");
        }
      } catch {
        /* ignore */
      }
    };

    fetchUser();
    fetchWithdrawals();
    fetchClaims();

    const interval = setInterval(() => {
      fetchUser();
      fetchWithdrawals();
      fetchClaims();
    }, 10000);
    return () => clearInterval(interval);
  }, [API_BASE]);

  const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;

  // ✅ Claim button state/label
  const claimDisabled =
    !eligible || claimStatus === "pending" || claimStatus === "approved";
  const claimLabel =
    claimStatus === "pending" ? "PENDING" :
    claimStatus === "approved" ? "APPROVED" :
    eligible ? "CLAIM" : "CLAIM (min $50)";

  return (
    <div className="dash_container">
      <div className="topbar">
        <div style={{display: "flex", justifyContent: 'right', width: "100%"}}>
          {/* Claim + Deposit */}
          {claimDisabled ? (
            <button
              className="tab withdraw"
              style={{ background: "#10b981", opacity: 0.7, cursor: "not-allowed" }}
              disabled
              title={eligible ? "Wait for admin decision" : "Requires minimum $50 balance"}
            >
              {claimLabel}
            </button>
          ) : (
            <Link to={"/product_claim"}>
              <button className="tab withdraw" style={{ background: "#10b981" }}>
                {claimLabel}
              </button>
            </Link>
          )}
          &nbsp;&nbsp;
          <Link to={"/payment"}>
            <button className="tab withdraw">DEPOSIT</button>
          </Link>
        </div>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: 8, borderRadius: 8, marginTop: 8 }}>
          {error}
        </div>
      )}

      <section className="cards" aria-label="Summary statistics">
        {/* ✅ Daily Incentive uses user.dailyProfit */}
        <article className="card">
          <h4>Daily Incentive</h4>
          <div className="value primary">{fmt(dailyProfit)}</div>
        </article>

        {/* ✅ Commission shows referral commission (excludes daily bonus) */}
        <article className="card">
          <h4>Commission</h4>
          <div className="value success">{fmt(totalProfit)}</div>
        </article>

        <article className="card">
          <h4>Total Earnings</h4>
          <div className="value warning">{fmt(totalProfit + dailyProfit)}</div>
        </article>

        <article className="card">
          <h4>Total Withdrawn</h4>
          <div className="value danger">{fmt(totalWithdrawn)}</div>
        </article>

        <article className="card">
          <h4>Pending Withdrawals</h4>
          <div className="value warning">{fmt(pendingWithdraw)}</div>
        </article>

        <article className="card">
          <h4>Package</h4>
          <div className="value" style={{ fontSize: "18px", fontWeight: "800", color: "#1f2937" }}>
            <a href="#" style={{ textDecoration: "none", color: "#2563eb" }}>
              {user ? `Perfume Package : ${Number(user.balance || 0)} $` : <CircularProgress />}
            </a>
          </div>
        </article>

        <article className="card card--wide">
          <h4>Rank</h4>
          <div className="value">{rank}</div>
        </article>
      </section>

      <nav className="tabs" aria-label="Primary actions">
        <div className="tab referrals" role="button" tabIndex="0" style={{ display: "flex", alignItems: "center", gap: 8, width: "40vw" }}>
          <button onClick={handleCopy} title="Copy referral code"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 28, height: 28, borderRadius: 8, border: "none",
              background: "rgba(255,255,255,0.15)", color: "#fff", cursor: "pointer",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
            </svg>
          </button>
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{refCode}</span>
          {copied && <span style={{ marginLeft: 6, fontSize: 12, color: "#e5e7eb" }}>Copied!</span>}
        </div>

        <Link to={'/user-dashboard/withdraw'}>
          <div className="tab withdraw" role="button" tabIndex="0" style={{ width: "40vw" }}>Withdraw Funds</div>
        </Link>
      </nav>
    </div>
  );
};

export default Dashboard;
