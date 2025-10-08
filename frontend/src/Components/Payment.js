// frontend/src/pages/PaymentStep.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Stack,
  Typography,
  Box,
  Tooltip,
  TextField,
  Alert,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import "../styling/App.css";

// ====== CONFIG (from frontend .env) ======
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
const ADMIN_WALLET = process.env.REACT_APP_ADMIN_WALLET || ""; // MUST be set
const BSC_USDT_CONTRACT =
  process.env.REACT_APP_BSC_USDT_CONTRACT;
const MIN_AMOUNT = 50;

export default function PaymentStep() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState("");

  const token = useMemo(() => sessionStorage.getItem("token"), []);

  // Optional Trust Wallet deep link (opens prefilled send screen)
  const trustUrl = useMemo(() => {
    if (!ADMIN_WALLET) return undefined;
    const q = new URLSearchParams({
      coin: "60", // EVM family
      address: ADMIN_WALLET,
      token_id: BSC_USDT_CONTRACT,
      amount: String(MIN_AMOUNT),
    });
    return `https://link.trustwallet.com/send?${q.toString()}`;
  }, []);

  const copyAddress = async () => {
    try {
      if (!ADMIN_WALLET) {
        alert("Admin wallet is not configured in the app. Please contact support.");
        return;
      }
      await navigator.clipboard.writeText(ADMIN_WALLET);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      alert("Could not copy. Please copy manually.");
    }
  };

  const handlePaymentVerify = async () => {
    try {
      if (!token) {
        alert("❌ User not authenticated!");
        return;
      }

      const clean = (txHash || "").trim();
      // Validate BSC transaction hash: 0x + 64 hex chars (total length 66)
      const isValid = /^0x([A-Fa-f0-9]{64})$/.test(clean);
      if (!isValid) {
        alert("Invalid transaction hash (starts with 0x and Minimum 66 characters).");
        return;
      }

      setLoading(true);

      const payload = {
        amount: MIN_AMOUNT,
        txHash: clean,
      };

      const res = await axios.post(`${API_BASE}/api/payments/verify`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(res.data?.message || "✅ Payment verified.");
      sessionStorage.setItem("isPaymentDone", "true");
      navigate("/user-dashboard/dashboard");
    } catch (err) {
      console.error("Payment Error:", err);
      const msg =
        err?.response?.data?.message ||
        "❌ Payment verification failed. If you already paid, paste your Tx Hash for instant verification.";
      const confs = err?.response?.data?.confirmations;

      // ⬇️ Extra handling for below-minimum deposits
      if (msg.includes("below minimum")) {
        alert(`⚠️ ${msg}\nOnly deposits of $${MIN_AMOUNT} USDT or more are accepted.`);
      } else {
        alert(typeof confs === "number" ? `Trasection ID is not found`: msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-title">COMPLETE YOUR PAYMENT TO CONTINUE</h2>

        {!ADMIN_WALLET && (
          <Alert severity="error" sx={{ mb: 2 }}>
            REACT_APP_ADMIN_WALLET is not set. Configure your frontend environment before proceeding.
          </Alert>
        )}

        <p className="payment-text">
          Deposit <b>${MIN_AMOUNT} USDT (BEP-20)</b> on <b>BNB Smart Chain (BSC)</b> to proceed.
        </p>

        {/* Wallet box */}
        <div className="wallet-box">
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
            <code className="wallet-address">{ADMIN_WALLET || "(not configured)"}</code>
            <Tooltip title={copied ? "Copied!" : "Copy address"} placement="top">
              <Button size="small" variant="outlined" onClick={copyAddress} sx={{ minWidth: 0, px: 1 }}>
                {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              </Button>
            </Tooltip>
          </Box>
        </div>

        {/* Tx hash input */}
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Paste your Tx Hash (recommended)"
            placeholder="0x..."
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{
              style: { color: "#fff" }, // label color (dark UI)
            }}
            sx={{
              minWidth: { xs: "100%", sm: 280 },

              // input text color
              "& .MuiInputBase-input": {
                color: "#fff",
              },

              // placeholder color
              "& .MuiInputBase-input::placeholder": {
                color: "#aaa",
                opacity: 1,
                fontSize: "12px",
              },

              // outlined border colors
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#fff",
                },
                "&:hover fieldset": {
                  borderColor: "#00e676", // green on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2196f3", // blue when focused
                },
              },
            }}
          />
          <Typography variant="caption" sx={{ opacity: 0.8, color: "#ccc" }}>
            ⚠️ Only deposits of <b>${MIN_AMOUNT} or more</b> will be accepted.
          </Typography>
        </Box>

        {/* Action buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 2, mb: 2 }}
        >
          <Button
            variant="contained"
            color="success"
            href={trustUrl}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!trustUrl}
          >
            💳 Pay with Trust Wallet
          </Button>

          <Button variant="contained" color="primary" onClick={handlePaymentVerify} disabled={loading}>
            {loading ? "Verifying…" : "I Have Paid"}
          </Button>
        </Stack>

        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
          After sending the payment in Trust Wallet, copy the <b>Tx Hash</b> from the transaction details, paste it
          above, then click “I Have Paid”.
        </Typography>
      </div>
    </div>
  );
}
