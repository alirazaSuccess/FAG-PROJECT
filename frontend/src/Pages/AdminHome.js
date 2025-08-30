import React from "react";

const AdminHome = ({ referrals, dailyProfit, totalProfit, rank }) => {
  return (
    <div className="admin_dash_container">
      {/* Top bar */}
      <div className="topbar">
        <h1 style={{ color: "white" }}>Admin Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <section className="cards" aria-label="Summary statistics">
        <article className="card" aria-labelledby="profit">
          <h4 id="profit">Profit</h4>
          <div className="value primary">$0</div>
        </article>

        <article className="card" aria-labelledby="commission">
          <h4 id="commission">Commission</h4>
          <div className="value success">$0</div>
        </article>

        <article className="card" aria-labelledby="earnings">
          <h4 id="earnings">Total Earnings</h4>
          <div className="value warning">$0</div>
        </article>

        <article className="card" aria-labelledby="withdraw">
          <h4 id="withdraw">Total Withdraw</h4>
          <div className="value danger">$0</div>
        </article>

        <article className="card card--wide" aria-labelledby="package">
          <h4 id="package">Package</h4>
          <div
            className="value"
            style={{ fontSize: "18px", fontWeight: "800", color: "#1f2937" }}
          >
            <a
              href="#"
              style={{ textDecoration: "none", color: "#2563eb" }}
            >
              Perfume Pack ($50)
            </a>
          </div>
        </article>

        <article className="card card--wide" aria-labelledby="rank">
          <h4 id="rank">Rank</h4>
          <div className="value" style={{ color: "#b45309" }}>GOLD</div>
        </article>
      </section>

      {/* Tabs */}
      <nav className="tabs" aria-label="Primary actions">
        <div className="tab profile" role="button" tabIndex="0">Profile</div>
        <div className="tab referrals" role="button" tabIndex="0">Referrals</div>
        <div className="tab settings" role="button" tabIndex="0">Settings</div>
        <div className="tab withdraw" role="button" tabIndex="0">Withdraw Funds</div>
      </nav>

      {/* Transaction History */}
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
                  No referral transactions yet.
                </td>
              </tr>
              {/* <tr>
                <td>dummy</td>
                <td>Referral Profit from</td>
                <td className="amount plus">10$</td>
                <td>
                  <span className="status badge">Completed</span>
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminHome;
