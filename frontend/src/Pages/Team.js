import React, { useEffect, useState } from "react";
import axios from "axios";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function Team() {
  const [team, setTeam] = useState([]); 
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data || {};

        // ✅ Team list (all referred users)
        const allRefs = userData.referrals || [];

        console.log(allRefs)

        // ✅ ReferralHistory (commissions etc.)
        const history = (userData.referralHistory || []).filter(
          (h) => h.name !== "dailyProfit");

        // ✅ Merge both arrays
        const combined = allRefs.map((refUser) => {
          // user ki commission history nikalna
          const relatedHistory = history.filter(
            (h) => h.referredUser?.toString() === refUser._id?.toString()
          );

          return {
            name: refUser.username || "Unnamed User",
            email: refUser.email || "-",
            joinedAt: refUser.createdAt || null,
            paid: refUser.balance >= 50, // example condition for paid
            history: relatedHistory,
          };
        });

        setTeam(combined);
      } catch (err) {
        console.error("Error fetching team:", err.response?.data || err.message);
      }
    };

    fetchTeam();
  }, []);

  const toggleUser = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="trasactionpanel team_panel">
      <div className="panel-header">
        <h2>Your Team</h2>
      </div>

      {team.length > 0 ? (
        <div className="team-list">
          {team.map((member, i) => (
            <div key={i} className="team-card">
              <div className="team-header" onClick={() => toggleUser(i)}>
                <div>
                  <strong>{member.name}</strong> 
                  <span style={{ color: member.paid ? "green" : "red", marginLeft: 10 }}>
                    {member.paid ? "Paid" : "Unpaid"}
                  </span>
                </div>
                <div className="toggle-icon">
                  {openIndex === i ? <KeyboardArrowDownIcon /> : <ChevronRightIcon />}
                </div>
              </div>

              {openIndex === i && (
                <div className="team-body">
                  <p><strong>Email:</strong> {member.email}</p>
                  <p><strong>Joined:</strong> {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : "-"}</p>
                  
                  <h4>Referral History:</h4>
                  {member.history.length > 0 ? (
                    member.history.map((h, idx) => (
                      <div key={idx} style={{ marginBottom: "5px", paddingLeft: "10px" }}>
                        <p>Profit: ${h.profit || 0}</p>
                        <p>Date: {h.date ? new Date(h.date).toLocaleDateString() : "-"}</p>
                      </div>
                    ))
                  ) : (
                    <p>No commission yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "10px" }}>No referrals found</p>
      )}
    </div>
  );
}