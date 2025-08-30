import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styling/admin_users.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/users",
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
            },
          }
        );
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      }
    };

    loadUsers();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getSubUsers = (parentId) => {
    return users.filter((u) => u.parentId === parentId);
  };

  const renderUserRow = (u, level = 0) => (
    <React.Fragment key={u._id}>
      <tr className="trasactionpanel team_panel">
        {/* Collapse arrow + indentation */}
        <td
          style={{
            paddingLeft: `${level * 5}px`, // indent based on level
            width: "50px",
          }}
        >
          {getSubUsers(u._id).length > 0 && (
            <span
              style={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => toggleExpand(u._id)}
            >
              {expanded[u._id] ? "▼" : "▶"}
            </span>
          )}
        </td>

        {/* Normal user data */}
        <td>{u.username}</td>
        <td>{u.email}</td>
        <td>{u.number || "-"}</td>
        <td>{u.address || "-"}</td>
        <td>{u.city || "-"}</td>
        <td>{u.country || "-"}</td>
        <td>${u.balance || 0}</td>
        <td>${u.dailyProfit || 0}</td>
        <td>${u.bonusEarned || 0}</td>
      </tr>

      {/* Show sub-users */}
      {expanded[u._id] &&
        getSubUsers(u._id).map((su) => renderUserRow(su, level + 1))}
    </React.Fragment>
  );

  return (
    <div className="admin-users-wrapper">
      <h1 className="admin_title">Users</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="table">
          <thead
            className="panel-header"
            style={{ border: "0.1px solid black" }}
          >
            <tr>
              <th></th> {/* Arrow column */}
              <th>Username</th>
              <th>Email</th>
              <th>Number</th>
              <th>Address</th>
              <th>City</th>
              <th>Country</th>
              <th>Balance</th>
              <th>Daily Profit</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((u) => !u.parentId) // root users only
              .map((u) => renderUserRow(u))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;