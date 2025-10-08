import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import "../styling/admin_users.css"; // keep your existing file; we’ll append new CSS below

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
          },
        });
        setUsers(response.data || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      }
    };
    loadUsers();
  }, [API_BASE]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const toggleExpand = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const getSubUsers = (parentId) => users.filter((u) => u.parentId === parentId);

  const renderHighlighted = (text, q) => {
    if (!q || !text) return text || "-";
    const s = String(text);
    const i = s.toLowerCase().indexOf(q);
    if (i === -1) return s;
    return (
      <>
        {s.slice(0, i)}
        <mark className="au2-mark">{s.slice(i, i + q.length)}</mark>
        {s.slice(i + q.length)}
      </>
    );
  };

  const matchFn = (u, q) => {
    if (!q) return false;
    const username = (u.username || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    return username.includes(q) || email.includes(q);
  };

  const { isSearching, rootsToRender, flatMatches } = useMemo(() => {
    const q = debouncedQuery;
    if (!q) {
      const roots = users.filter((u) => !u.parentId);
      return { isSearching: false, rootsToRender: roots, flatMatches: [] };
    }
    const matches = users.filter((u) => matchFn(u, q));
    return { isSearching: true, rootsToRender: [], flatMatches: matches };
  }, [users, debouncedQuery]);

  const renderUserRow = (u, level = 0) => (
    <React.Fragment key={u._id}>
      <tr className="au2-row">
        {/* Arrow / indentation */}
        <td className="au2-cell au2-cell--arrow" style={{ paddingLeft: `${level * 8}px` }}>
          {!isSearching && getSubUsers(u._id).length > 0 && (
            <span
              className="au2-arrow"
              onClick={() => toggleExpand(u._id)}
              title={expanded[u._id] ? "Collapse" : "Expand"}
            >
              {expanded[u._id] ? "▼" : "▶"}
            </span>
          )}
        </td>

        {/* Data cells */}
        <td className="au2-cell">{isSearching ? renderHighlighted(u.username, debouncedQuery) : (u.username || "-")}</td>
        <td className="au2-cell">{isSearching ? renderHighlighted(u.email, debouncedQuery) : (u.email || "-")}</td>
        <td className="au2-cell">{u.number || "-"}</td>
        <td className="au2-cell">{u.address || "-"}</td>
        <td className="au2-cell">{u.city || "-"}</td>
        <td className="au2-cell">{u.country || "-"}</td>
        <td className="au2-cell">${u.balance || 0}</td>
        <td className="au2-cell">${u.dailyProfit || 0}</td>
        <td className="au2-cell">${u.bonusEarned || 0}</td>
      </tr>

      {/* Children only when not searching */}
      {!isSearching &&
        expanded[u._id] &&
        getSubUsers(u._id).map((su) => renderUserRow(su, level + 1))}
    </React.Fragment>
  );

  return (
    <div className="au2-wrapper">
      <h1 className="au2-title">Users</h1>

      {/* Search */}
      <div className="au2-search">
        <TextField
          fullWidth
          size="small"
          placeholder="Search by username or email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "white" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "12px",
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "white",
              opacity: 1,
            },
          }}
        />
      </div>

      {(!users || users.length === 0) ? (
        <p className="au2-empty">No users found.</p>
      ) : (
        <div className="au2-card">
          <div className="au2-scroll">
            <table className="au2-table" role="table">
              <thead className="au2-thead">
                <tr className="au2-row au2-row--head">
                  <th className="au2-th au2-cell au2-cell--arrow"></th>
                  <th className="au2-th au2-cell">Username</th>
                  <th className="au2-th au2-cell">Email</th>
                  <th className="au2-th au2-cell">Number</th>
                  <th className="au2-th au2-cell">Address</th>
                  <th className="au2-th au2-cell">City</th>
                  <th className="au2-th au2-cell">Country</th>
                  <th className="au2-th au2-cell">Balance</th>
                  <th className="au2-th au2-cell">Daily Incentive</th>
                  <th className="au2-th au2-cell">Commission</th>
                </tr>
              </thead>
              <tbody className="au2-tbody">
                {!isSearching && rootsToRender.map((u) => renderUserRow(u))}
                {isSearching &&
                  (flatMatches.length > 0 ? (
                    flatMatches.map((u) => renderUserRow(u, 0))
                  ) : (
                    <tr className="au2-row">
                      <td className="au2-cell" colSpan={10} style={{ textAlign: "center", padding: "16px" }}>
                        No matches for “{query}”.
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;