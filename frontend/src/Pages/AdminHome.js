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
  });

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const { data } = await axios.get(`${API_BASE}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats({
        totalUsers: Number(data.totalUsers || 0),
        sumDailyProfit: Number(data.sumDailyProfit || 0),
        sumBonusEarned: Number(data.sumBonusEarned || 0),
        totalCommission: Number(data.totalCommission || 0),
        totalWithdraw: Number(data.totalWithdraw || 0),
        totalEarnings: Number(data.totalEarnings || 0),
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
      {/* Top bar */}
      <div className="topbar">
        <h1 style={{ color: "white" }}>Admin Dashboard</h1>
      </div>

      {err && (
        <div style={{ background:"#fee2e2", color:"#991b1b", padding:10, borderRadius:10, marginBottom:12 }}>
          {err}
        </div>
      )}

      {/* Summary Cards */}
      <section className="cards" aria-label="Summary statistics">
        <article className="card" aria-labelledby="profit">
          <h4 id="profit">Profit (Daily + Bonus)</h4>
          <div className="value primary">
            {loading ? "…" : fmt(stats.sumDailyProfit + stats.sumBonusEarned)}
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            Daily: {fmt(stats.sumDailyProfit)} &nbsp;•&nbsp; Bonus: {fmt(stats.sumBonusEarned)}
          </div>
        </article>

        <article className="card" aria-labelledby="commission">
          <h4 id="commission">Commission</h4>
          <div className="value success">{loading ? "…" : fmt(stats.totalCommission)}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            Sum of referral commissions (excl. Daily Bonus)
          </div>
        </article>

        <article className="card" aria-labelledby="earnings">
          <h4 id="earnings">Total Earnings</h4>
          <div className="value warning">{loading ? "…" : fmt(stats.totalEarnings)}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            Daily Profit + Commission
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
            <a href="#" style={{ textDecoration: "none", color: "#2563eb" }}>
              {loading ? "…" : `${stats.totalUsers} total users`}
            </a>
          </div>
        </article>
      </section>

      {/* Transaction History – keep your placeholder (can be enhanced later) */}
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
            <tbody>
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Coming soon…
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}