import React from 'react';
import Footer from '../Components/Footer';

export const TermsCondition = () => {
  return (
    <>
    <div style={{height: "70vh",}}>
      <div className="terms-container">
        <h2 className="terms-heading">Terms & Conditions – Fag World Perfume Program</h2>
        <ol className="terms-list">
          <li><strong>Membership Fee:</strong> Joining requires a one-time payment of <strong>$50</strong>.</li>
          <li><strong>Non-Refundable:</strong> Membership fee and purchases are non-refundable.</li>
          <li><strong>Commission Structure:</strong> Earnings depend on the official Buya Perfume multi-level plan.</li>
          <li><strong>Active Participation:</strong> Members must actively promote and follow company guidelines.</li>
          <li><strong>No Misrepresentation:</strong> Any false claims or misuse of brand name will lead to termination.</li>
          <li><strong>Product Sales:</strong> Commissions are based on actual sales and network performance.</li>
          <li><strong>Legal Compliance:</strong> Members must follow local laws and ethical practices.</li>
          <li><strong>Company Rights:</strong> Buya Perfume reserves the right to update or change terms anytime.</li>
        </ol>
        <p className="terms-note">* By joining the Program, you agree to these terms.</p>
      </div>
    </div>
    <Footer/>
    </>
  );
};
