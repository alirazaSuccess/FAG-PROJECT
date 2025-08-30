import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
const MIN = Number(process.env.REACT_APP_WITHDRAW_MIN || 10);

export default function User_Withdraw() {
  const token = useMemo(() => sessionStorage.getItem("token"), []);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const loadMine = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/users/withdrawals/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList(res.data.withdrawals || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadMine(); }, []);

  const submit = async () => {
    try {
      if (!token) return alert("Not authenticated");
      if (!amount || Number(amount) < MIN) return alert(`Minimum withdrawal is ${MIN} USDT`);
      if (!address) return alert("Enter your USDT-TRC20 address");

      setLoading(true);
      await axios.post(
        `${API_BASE}/api/users/withdrawals/request`,
        { amount: Number(amount), address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Withdraw request submitted");
      setAmount("");
      setAddress("");
      loadMine();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Withdraw USDT (TRC20)</h2>

      <div style={{ maxWidth: 420, margin: "12px 0" }}>
        <div style={{ margin: "8px 0" }}>
          <label>Amount (USDT)</label>
          <input
            type="number"
            min={MIN}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 8 }}
          />
        </div>

        <div style={{ margin: "8px 0" }}>
          <label>Your TRC20 Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Txxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            style={{ width: "100%", padding: 10, borderRadius: 8 }}
          />
        </div>

        <button onClick={submit} disabled={loading} className="btn-submit">
          {loading ? "Submitting…" : "Request Withdraw"}
        </button>
      </div>

      <h3>Your Requests</h3>
      {list.map((w) => (
        <div key={w._id} style={{ border: "1px solid #eee", padding: 12, margin: "8px 0" }}>
          <div>
            <b>{w.amount} {w.currency}</b> on {w.chain} → {w.address}
          </div>
          <div>Status: {w.status}{w.txId ? `  •  Tx: ${w.txId}` : ""}</div>
          <div style={{ opacity: 0.7, fontSize: 12 }}>Created: {new Date(w.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}