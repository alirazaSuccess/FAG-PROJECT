/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

export default function AdminHome() {
  const token = useMemo(
    () => sessionStorage.getItem("adminToken") || sessionStorage.getItem("token"),
    []
  );

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    sumDailyProfit: 0,
    sumBonusEarned: 0,
    totalCommission: 0,
    totalWithdraw: 0,
    totalEarnings: 0,
    totalDeposits: 0,
    sumUserBalances: 0, // 👈 NEW
  });

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const load = async () => {
    try {
      setLoading(true);
      setErr("");

      // 1) Admin stats (your existing call)
      const { data } = await axios.get(`${API_BASE}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 2) All users (your existing call; renamed to usersRes for clarity)
      const usersRes = await axios.get(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];

      // 3) Sum of all users' current balances
      const sumUserBalances = users.reduce(
        (acc, u) => acc + Number(u?.balance || 0),
        0
      );

      setStats({
        totalUsers: Number(data.totalUsers || 0),
        sumDailyProfit: Number(data.sumDailyProfit || 0),
        sumBonusEarned: Number(data.sumBonusEarned || 0),
        totalCommission: Number(data.totalCommission || 0),
        totalWithdraw: Number(data.totalWithdraw || 0),
        totalEarnings: Number(data.totalEarnings || 0),
        totalDeposits: Number(
          data.totalDeposits ?? data.sumDeposits ?? data.totalDeposit ?? data.sumDeposit ?? 0
        ),
        sumUserBalances, // 👈 keep from /users
      });
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
        (e?.response?.status === 403 ? "Forbidden (admin only)" : "Failed to load stats")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) load(); }, []); // eslint-disable-line

  const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;

  return (
    <div className="admin_dash_container">

      {err && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: 10, borderRadius: 10, marginBottom: 12 }}>
          {err}
        </div>
      )}

      {/* Summary Cards */}
      <section className="cards" aria-label="Summary statistics">

        {/* NEW: Sum of all users' current wallet balances */}
        <article className="card" aria-labelledby="balances">
          <h4 id="balances">Total</h4>
          <div className="value primary">{loading ? "…" : fmt(stats.sumUserBalances)}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            Current balances across all users
          </div>
        </article>

        <article className="card" aria-labelledby="profit">
          <h4 id="profit">Total User Incentive</h4>
          <div className="value primary">
            {loading ? "…" : fmt(stats.sumDailyProfit)}
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            Daily: {fmt(stats.sumDailyProfit)}
          </div>
        </article>

        <article className="card" aria-labelledby="commission">
          <h4 id="commission">Commission</h4>
          <div className="value success">{loading ? "…" : fmt(stats.sumBonusEarned)}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            Commission: {fmt(stats.sumBonusEarned)}
          </div>
        </article>

        <article className="card" aria-labelledby="earnings">
          <h4 id="earnings">Total Earnings</h4>
          <div className="value warning">{loading ? "…" : fmt(stats.sumDailyProfit + stats.sumBonusEarned)}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            Total Incentive + Commission
          </div>
        </article>

        <article className="card" aria-labelledby="withdraw">
          <h4 id="withdraw">Total Withdraw</h4>
          <div className="value danger">{loading ? "…" : fmt(stats.totalWithdraw)}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            All requests (any status)
          </div>
        </article>

        <article className="card card--wide" aria-labelledby="package">
          <h4 id="package">Users</h4>
          <div
            className="value"
            style={{ fontSize: "18px", fontWeight: 800, color: "#1f2937" }}
          >
            <a href="/admin/users" style={{ textDecoration: "none", color: "#2563eb" }}>
              {loading ? "…" : `${stats.totalUsers} total users`}
            </a>
          </div>
        </article>
      </section>

      {/* Transaction History – placeholder */}
      <section className="trasactionpanel" aria-label="Transaction History">
        <div className="panel-header">Transaction History</div>
        <div className="panel-body">
          <table className="table" role="grid">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Description</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
          </table>
        </div>
      </section>
    </div>
  );
}
