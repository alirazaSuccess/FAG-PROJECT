import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CircularProgress from "@mui/material/CircularProgress";

export default function Team() {
  const [root, setRoot] = useState(null);       // nested tree root (me)
  const [openIds, setOpenIds] = useState(() => new Set()); // which nodes are expanded
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
  const token = useMemo(() => sessionStorage.getItem("token"), []);

  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  // Toggle expand/collapse for any node by its id
  const toggle = useCallback((id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      setLoading(true);

      try {
        // ---------- 1) GET /me ----------
        const meRes = await axios.get(`${API_BASE}/api/users/me`, { headers });
        const me = meRes.data || {};

        // ---------- 2) Build maps from /me ----------
        // (A) YOUR earnings per user from referralHistory (name/email -> sum(profit))
        const hist = (me.referralHistory || []).filter(
          (h) => (h?.name || "").toLowerCase() !== "daily bonus"
        );
        const earnedByKey = new Map(); // key = (email || name).toLowerCase()
        for (const h of hist) {
          const key = (h.email || h.name || "").toLowerCase().trim();
          if (!key) continue;
          earnedByKey.set(key, (earnedByKey.get(key) || 0) + Number(h.profit || 0));
        }

        // (B) Fallback maps from embedded referrals (id + email/username -> bonusEarned)
        const bonusById = new Map();
        const bonusByKey = new Map();

        // We’ll traverse /me recursively once to collect bonusEarned for every node we see.
        const collectBonuses = (node) => {
          if (!node || typeof node !== "object") return;
          const id = String(node?._id || node?.id || "");
          const key = (node?.email || node?.username || node?.name || "").toLowerCase().trim();
          const val = Number(node?.bonusEarned || 0);
          if (id) bonusById.set(id, (bonusById.get(id) || 0) + val);
          if (key) bonusByKey.set(key, (bonusByKey.get(key) || 0) + val);

          const kids = Array.isArray(node?.referrals) ? node.referrals : [];
          for (const k of kids) collectBonuses(k);
        };
        collectBonuses(me);

        // ---------- 3) Helpers ----------
        const toKey = (u) =>
          (u?.email || u?.username || u?.name || "").toLowerCase().trim();

        // show YOUR earned first; if not found, fallback to that user's own bonusEarned
        const commissionFor = (u, isRoot = false) => {
          if (!u) return 0;
          // Root (main user): show their own bonus (if you want root to display something)
          if (isRoot) {
            const key = toKey(u);
            const idKey = String(u?._id || u?.id || "");
            if (typeof u?.bonusEarned === "number") return Number(u.bonusEarned);
            if (idKey && bonusById.has(idKey)) return Number(bonusById.get(idKey));
            if (key && bonusByKey.has(key)) return Number(bonusByKey.get(key));
            // fallback to history if they paid you somehow
            if (key && earnedByKey.has(key)) return Number(earnedByKey.get(key));
            return 0;
          }

          // For referrals: prefer YOUR earnings from them (history)
          const key = toKey(u);
          const idKey = String(u?._id || u?.id || "");

          if (key && earnedByKey.has(key)) return Number(earnedByKey.get(key));
          // fallback to user's own bonus so UI never shows 0 when there is their own data
          if (idKey && bonusById.has(idKey)) return Number(bonusById.get(idKey));
          if (key && bonusByKey.has(key)) return Number(bonusByKey.get(key));

          return 0;
        };

        const getChildrenFromMe = (u) => {
          // main, expected nested field
          if (Array.isArray(u?.referrals)) return u.referrals;

          // OPTIONAL graceful fallbacks if backend used different names
          if (Array.isArray(u?.children)) return u.children;
          if (Array.isArray(u?.downline)) return u.downline;
          if (Array.isArray(u?.team)) return u.team;

          return [];
        };

        // ---------- 4) Normalize from /me recursively ----------
        const normFromMe = (u, isRoot = false) => {
          if (!u || typeof u !== "object") return null;

          const normalized = {
            id: String(u._id || u.id || ""),
            name: u.username || u.name || "-",
            email: u.email || "",
            joinedAt: u.createdAt ? new Date(u.createdAt) : null,
            paid: Number(u.balance || 0) >= 50,
            totalCommission:
              typeof u.totalCommission === "number"
                ? Number(u.totalCommission)
                : commissionFor(u, isRoot),
            children: [],
          };

          const kids = getChildrenFromMe(u);
          if (kids.length) {
            normalized.children = kids
              .map((child) => normFromMe(child, false))
              .filter(Boolean);
          }

          return normalized;
        };

        // Build the full tree ONLY from /me
        const treeRoot = normFromMe(me, true);

        setRoot(treeRoot);
        // Open root & first level by default
        const firstLevelIds = (treeRoot?.children || []).map((c) => c.id);
        setOpenIds(new Set([treeRoot?.id, ...firstLevelIds].filter(Boolean)));
      } catch (e) {
        console.error("Tree load error:", e?.response?.data || e?.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [API_BASE, headers, token]);

  // Recursive renderer
  const Node = ({ node, depth = 0 }) => {
    const hasKids = node.children && node.children.length > 0;
    const open = openIds.has(node.id);

    return (
      <div style={{ marginLeft: depth === 0 ? 0 : 16 }}>
        {/* Row */}
        <div
          onClick={() => (hasKids ? toggle(node.id) : null)}
          style={{
            cursor: hasKids ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px",
            borderRadius: 10,
            margin: "8px 0",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {hasKids ? (
              open ? <KeyboardArrowDownIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />
            ) : (
              <span style={{ width: 18 }} />
            )}
            <div style={{ fontWeight: 700 }}>{node.name}</div>
            <span
              style={{
                color: node.paid ? "limegreen" : "tomato",
                fontWeight: 600,
                fontSize: 12,
              }}
            >
              {node.paid ? "Paid" : "Unpaid"}
            </span>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12 }}>
              Commission: <b>${Number(node.totalCommission || 0).toFixed(2)}</b>
            </div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              Joined: {node.joinedAt ? node.joinedAt.toLocaleDateString() : "-"}
            </div>
          </div>
        </div>

        {/* Children */}
        {hasKids && open && (
          <div>
            {node.children.map((c) => (
              <Node key={c.id} node={c} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="trasactionpanel team_panel">
      <div className="panel-header">
        <h2>REFERRALS</h2>
      </div>

      {loading ? (
        <CircularProgress />
      ) : !root ? (
        <p style={{ textAlign: "center", marginTop: 10 }}>NO REFERRAL</p>
      ) : (
        <div className="team-list">
          <Node node={root} depth={0} />
        </div>
      )}
    </div>
  );
}
