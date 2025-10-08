import React from 'react';
import Footer from '../Components/Footer';

export const Privacy_Policy = () => {
  return (
    <>
    <div style={{height: "70vh"}}>
    <div className="terms-container">
      <h2 className="terms-heading">Privacy Policy – Fag World Perfume Program</h2>
      <ol className="terms-list">
        <li><strong>Personal Data:</strong> We collect basic details (name, contact, payment info) only for registration and business use.</li>
        <li><strong>Data Protection:</strong> Your information is kept secure and never sold or shared with third parties without consent.</li>
        <li><strong>Usage:</strong> Data is used only for commission tracking, program updates, and communication.</li>
        <li><strong>Confidentiality:</strong> Members are responsible for keeping their login and account details private.</li>
        <li><strong>Updates:</strong> Buy a Perfume may update this policy; members will be notified.</li>
      </ol>
      <p className="terms-note">* By joining, you agree to our Privacy Policy.</p>
    </div>
    </div>
      <Footer/>
    </>
  );
};