import axios from "axios";
import React, { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const User_Profit = () => {
  const [referrals, setReferrals] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const history = (res.data?.referralHistory || []).filter(
          (r) => r.name !== "Daily Bonus"
        );

        // ✅ Group by name (ya email bhi use kar sakte ho)
        const grouped = history.reduce((acc, ref) => {
          if (!acc[ref.name]) acc[ref.name] = [];
          acc[ref.name].push(ref);
          return acc;
        }, {});

        setReferrals(grouped);
        setTotalProfit(
          history.reduce((sum, r) => sum + Number(r.profit || 0), 0)
        );
      } catch (err) {
        console.error(
          "Error fetching user referral profit:",
          err?.response?.data || err.message
        );
      }
    };
    fetchUser();
  }, []);

  const toggleGroup = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const groupKeys = Object.keys(referrals);

  return (
    <div className="trasactionpanel team_panel">
      <div className="panel-header">
        <h2>Referral Commission</h2>
        <p style={{ color: "black" }}>
          <strong>Total Commission:</strong> ${totalProfit}
        </p>
      </div>

      {groupKeys.length > 0 ? (
        <div className="referral-groups">
          {groupKeys.map((name, i) => (
            <div key={i} className="referral-group">
              {/* Header Row */}
              <div
                className="referral-header"
                onClick={() => toggleGroup(i)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "8px",
                  border: "1px solid #ccc",
                  marginTop: "5px",
                  background: "#f9f9f9",
                }}
              >
                <span>
                  <strong>{name}</strong>
                </span>
                <span>
                  {openIndex === i ? (
                    <KeyboardArrowDownIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </span>
              </div>

              {/* Collapsible Body */}
              {openIndex === i && (
                <table className="table" style={{ marginTop: "5px" }}>
                  <thead>
                    <tr>
                      <th>Earned</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals[name].map((ref, j) => (
                      <tr key={j}>
                        <td>${Number(ref.profit || 0)}</td>
                        <td>
                          {ref.date
                            ? new Date(ref.date).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          No referrals yet.
        </p>
      )}
    </div>
  );
};

export default User_Profit;