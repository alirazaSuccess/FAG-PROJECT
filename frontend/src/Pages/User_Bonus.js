import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

// ---- Milestones config (as per your scenario) ----
const MILESTONES = [
  { level: 4,  rank: "Platinum",   reward: "Mobile Phone",  rewardValue: 100 },
  { level: 7,  rank: "Emerald",      reward: "International Tour", rewardValue: 1000 },
  { level: 10, rank: "Legendary",  reward: "Car 1000cc",    rewardValue: 10000 },
];

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const User_Bonus = () => {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: resolve numeric level from backend data
  // Prefer: me.level (number). Fallbacks: from me.rank text if needed.
  const level = useMemo(() => {
    if (!me) return 0;
    if (typeof me.level === "number") return me.level;

    // --- soft fallback from rank text if backend doesn't expose numeric level ---
    const map = { starter: 0, bronze: 1, silver: 2, gold: 3, platinum: 4, Sapphire: 5,Ruby: 6, Emerald: 7,Diamond: 8,Crown: 9, legendary: 10 };
    const rk = String(me.rank || "").toLowerCase().trim();
    return map[rk] || 0;
  }, [me]);

  const rank = me?.rank || "STARTER";

  useEffect(() => {
    const run = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const { data } = await axios.get(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMe(data);
      } catch (e) {
        console.error("User_Bonus: /me failed", e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const fmt$ = (n) => `$${Number(n || 0).toLocaleString()}`;

  if (loading) {
    return (
      <section className="ranks-section">
        <div className="ranks_container">
          <h1 className="section-title">BONUS</h1>
          <div><CircularProgress/></div>
        </div>
      </section>
    );
  }

  return (
    <section className="ranks-section">
      <div className="ranks_container">
        <h2 className="section-title">BONUS</h2>

        {/* Current rank/level summary */}
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: 12,
            marginBottom: 14,
            color: "#e5e7eb",
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span><b>Current Rank:</b> {rank}</span>
          <span style={{ opacity: 0.8 }}>|</span>
          <span><b>Current Level:</b> {level}</span>
        </div>

        <div className="ranks-grid">
          {MILESTONES.map((m) => {
            const unlocked = level >= m.level;
            const remainingLevels = Math.max(m.level - level, 0);

            return (
              <div
                key={m.level}
                className="rank-card"
                style={{
                  border:
                    unlocked
                      ? "1px solid rgba(34,197,94,0.4)"
                      : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: unlocked ? "0 0 0 1px rgba(34,197,94,0.25) inset" : "none",
                }}
              >
                <h2 style={{ marginBottom: 6 }}>
                  Level {m.level} — {m.rank} Rank
                </h2>

                <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 6, color: "black", }}>
                  Reward: <b>{m.reward}</b> ({fmt$((m.rewardValue))})
                </div>

                {/* Status pill */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    color: unlocked ? "#10b981" : "#f59e0b",
                    background: unlocked
                      ? "rgba(16,185,129,0.12)"
                      : "rgba(245,158,11,0.12)",
                    border: `1px solid ${
                      unlocked ? "rgba(16,185,129,0.35)" : "rgba(245,158,11,0.35)"
                    }`,
                    marginTop: 10,
                    marginBottom: 8,
                  }}
                >
                  {unlocked ? "Unlocked ✅" : "Locked 🔒"}
                </div>

                {/* Progress / guidance */}
                {!unlocked ? (
                  <p style={{ marginTop: 6, fontSize: 13, color: "#cbd5e1" }}>
                    You need <b>{remainingLevels}</b> more level
                    {remainingLevels > 1 ? "s" : ""} to reach <b>{m.rank}</b>.
                  </p>
                ) : (
                  <p style={{ marginTop: 6, fontSize: 13, color: "#a7f3d0" }}>
                    Congratulations! You are eligible for <b>{m.reward}</b>.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default User_Bonus;
