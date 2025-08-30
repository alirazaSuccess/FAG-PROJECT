import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function Admin_Request() {
  // read either token key
  const token = useMemo(
    () => sessionStorage.getItem("token") || sessionStorage.getItem("adminToken"),
    []
  );
  const [list, setList] = useState([]);

  const load = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/withdrawals?status=pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList(res.data.withdrawals || []);
    } catch (e) {
      if (e?.response?.status === 401) {
        alert("Your admin session expired. Please log in again.");
        window.location.href = "/admin-login";
      } else {
        alert(e?.response?.data?.message || "Failed to load withdrawals.");
      }
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const approve = async (id) => {
    if (!window.confirm("Approve & pay via KuCoin?")) return;
    try {
      await axios.post(`${API_BASE}/api/admin/withdrawals/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Paid");
      load();
    } catch (e) {
      alert(e?.response?.data?.message || "Approve failed");
    }
  };

  const reject = async (id) => {
    const reason = prompt("Reason?");
    try {
      await axios.post(`${API_BASE}/api/admin/withdrawals/${id}/reject`, { reason }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      load();
    } catch (e) {
      alert(e?.response?.data?.message || "Reject failed");
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Pending Withdrawals</h2>
      {list.length === 0 && <div>No pending requests</div>}
      {list.map((w) => (
        <div key={w._id} style={{ border: "1px solid #eee", padding: 12, margin: "8px 0" }}>
          <div>
            User: {w.user?.email} | Amount: <b>{w.amount} {w.currency || "USDT"}</b> | Chain: {w.chain || "TRON"}
          </div>
          <div>Address: {w.address}</div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button onClick={() => approve(w._id)} className="btn-submit">Approve & Pay</button>
            <button onClick={() => reject(w._id)} className="btn-cancel">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}