// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function PaymentStep() {
//   const [paymentDone, setPaymentDone] = useState("0");
//   const navigate = useNavigate();

//   const handlePayment = async () => {
//     try {
//       const amount = parseFloat(paymentDone);

//       if (isNaN(amount) || amount < 50) {
//         alert("Minimum deposit required is $50");
//         return;
//       }

//       const token = sessionStorage.getItem("token");
//       if (!token) {
//         alert("User not authenticated!");
//         return;
//       }


//       // ✅ Payment request
//       const res = await axios.post(
//         "http://localhost:5000/api/users/payment",
//         { amount },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert(res.data.message);

//       // ✅ Save in sessionStorage
//       sessionStorage.setItem("isPaymentDone", "true");

//       navigate("/user-dashboard/dashboard");
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Payment failed. Try again!");
//     }
//   };

//   return (
//     <div style={{
//       display: 'flex', justifyContent: 'center', flexDirection: "column",
//       textAlign: "center", width: "100%", alignItems: "center",
//       height: '100vh', gap: "20px"
//     }}>
//       <div>
//         <h1 style={{ color: "green" }}><i>THANK YOU FOR REGISTRATION</i></h1>
//         <h2 style={{ color: "white", margin: "20px 0px" }}>COMPLETE YOUR PAYMENT TO CONTINUE</h2>
//         <p style={{ color: "white", padding: "30px 0px" }}>
//           You must add at least $50 to proceed.
//         </p>
//         <div style={{ display: "flex", gap: "20px", alignItems: "center", justifyContent: 'center' }}>
//           <input
//             type="number"
//             min="50"
//             placeholder="Enter amount"
//             value={paymentDone}
//             onChange={(e) => setPaymentDone(e.target.value)}
//             style={{ padding: "17px 5px", width: "300px", borderRadius: "10px" }}
//           />
//           <button className="btn-submit" onClick={handlePayment}>Pay & Continue</button>
//         </div>
//       </div>
//     </div>
//   );
// }
// frontend/src/pages/PaymentStep.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Stack, Typography, Box, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import "../styling/App.css";

// ====== CONFIG (can also be moved to .env with REACT_APP_*) ======
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
const ADMIN_WALLET =
  process.env.REACT_APP_ADMIN_WALLET || "TUz6fmqbp9ZcKbgEvaSXsNREWR1Jd4nhJR";
const USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // TRC20 USDT (mainnet)
const MIN_AMOUNT = 50; // fixed (no input)

export default function PaymentStep() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const token = useMemo(() => sessionStorage.getItem("token"), []);

  // Build Trust Wallet deep link with fixed amount
  const trustUrl = useMemo(() => {
    const q = new URLSearchParams({
      coin: "195", // TRON
      address: ADMIN_WALLET,
      token_id: USDT_CONTRACT, // TRC20 USDT
      amount: String(MIN_AMOUNT),
    });
    return `https://link.trustwallet.com/send?${q.toString()}`;
  }, []);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(ADMIN_WALLET);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      alert("Could not copy. Please copy manually.");
    }
  };

  // Verify deposit on-chain (server looks up incoming TRC20 USDT to ADMIN_WALLET)
  const handlePaymentVerify = async () => {
    try {
      if (!token) {
        alert("❌ User not authenticated!");
        return;
      }
      setLoading(true);

      const res = await axios.post(
        `${API_BASE}/api/users/verify-payment`,
        { amount: MIN_AMOUNT },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data?.message || "✅ Payment verified.");
      sessionStorage.setItem("isPaymentDone", "true");
      navigate("/user-dashboard/dashboard");
    } catch (err) {
      console.error("Payment Error:", err);
      alert(
        err?.response?.data?.message ||
          "❌ Payment verification failed. Please try again in a minute."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-title">COMPLETE YOUR PAYMENT TO CONTINUE</h2>

        <p className="payment-text">
          🚀 Deposit <b>${MIN_AMOUNT} USDT (TRC20)</b> to proceed.
        </p>

        {/* Wallet box */}
        <div className="wallet-box">
          <Typography variant="body1" sx={{ mb: 1 }}>
            Send USDT (TRC20) to this wallet:
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
              mb: 1,
              flexWrap: "wrap",
            }}
          >
            <code className="wallet-address">{ADMIN_WALLET}</code>
            <Tooltip title={copied ? "Copied!" : "Copy address"} placement="top">
              <Button
                size="small"
                variant="outlined"
                onClick={copyAddress}
                sx={{ minWidth: 0, px: 1 }}
              >
                {copied ? (
                  <CheckIcon fontSize="small" />
                ) : (
                  <ContentCopyIcon fontSize="small" />
                )}
              </Button>
            </Tooltip>
          </Box>
        </div>

        {/* Action buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 2, mb: 2 }}
        >
          {/* Trust Wallet button (fixed amount) */}
          <Button
            variant="contained"
            color="success"
            href={trustUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            💳 Pay with Trust Wallet
          </Button>

          {/* Verify button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handlePaymentVerify}
            disabled={loading}
          >
            {loading ? "Verifying…" : "I Have Paid"}
          </Button>
        </Stack>

        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
          After sending the payment, wait ~30–60 seconds for confirmations, then
          click “I Have Paid” to verify on-chain.
        </Typography>
      </div>
    </div>
  );
}

