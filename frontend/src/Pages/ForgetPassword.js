/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // email | otp | reset | done
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // NEW: toggles
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const sendOtp = async () => {
    if (!email) return alert("Please enter your email.");
    try {
      setLoading(true); setMsg("");
      await axios.post(`${API_BASE}/api/users/forgot-password/otp`, { email: email.trim() });
      setStep("otp"); setMsg("If the email exists, a 6-digit code has been sent.");
    } catch {
      setStep("otp"); setMsg("If the email exists, a 6-digit code has been sent.");
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (!email || !otp) return alert("Enter the 6-digit code.");
    try {
      setLoading(true); setMsg("");
      const res = await axios.post(`${API_BASE}/api/users/forgot-password/otp/verify`, {
        email: email.trim(),
        otp: otp.trim(),
      });
      setTempToken(res.data?.tempToken || "");
      setStep("reset"); setMsg("OTP verified. Please set a new password.");
    } catch (e) {
      alert(e?.response?.data?.message || "Invalid or expired OTP.");
    } finally { setLoading(false); }
  };

  const resetWithOtp = async () => {
    if (!password || password.length < 8) return alert("Password must be at least 8 characters.");
    if (password !== confirm) return alert("Passwords do not match.");
    try {
      setLoading(true); setMsg("");
      await axios.post(`${API_BASE}/api/users/forgot-password/otp/reset`, {
        email: email.trim(),
        tempToken,
        password,
      });
      setStep("done"); setMsg("Password updated. You can sign in now.");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to reset password. Try again.");
    } finally { setLoading(false); }
  };

  const Eye = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size}><path fill="currentColor" d="M12 5c5 0 9 5 9 7s-4 7-9 7-9-5-9-7 4-7 9-7zm0 2C8 7 4.7 10.9 4.2 12 4.7 13.1 8 17 12 17s7.3-3.9 7.8-5C19.3 9.9 16 7 12 7zm0 2a3 3 0 110 6 3 3 0 010-6z"/></svg>
  );
  const EyeOff = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size}><path fill="currentColor" d="M2 3.3L3.3 2 22 20.7 20.7 22l-2.6-2.6A11.4 11.4 0 0112 19c-5 0-9-5-9-7a9.9 9.9 0 014.6-6.1L2 3.3zM7.1 6.2A8.6 8.6 0 003.9 12c.5 1.1 3.8 5 8.1 5 1.5 0 2.8-.4 4-.9l-1.8-1.8A4 4 0 019 12a3.9 3.9 0 01.4-1.7L7.1 6.2zM12 5c5 0 9 5 9 7 0 .9-.4 2-1.1 3l-1.4-1.4c.3-.5.5-1 .5-1.6C19 10.7 15.7 7 12 7c-.6 0-1.1.1-1.6.3L8.7 5.6A7.7 7.7 0 0112 5z"/></svg>
  );

  return (
    <div className="forgotcontainer" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div className="fp2-card" style={{ maxWidth: 480, width: "100%" }}>
        <h3 className="fp2-title" style={{ marginBottom: 8 }}>Reset your password</h3>
        <p style={{ marginTop: 0, color: "#7a8aa0" }}>
          <Link to="/register" style={{ textDecoration: "none", color: "#fff" }}>← Back to Sign In</Link>
        </p>

        {step === "email" && (
          <>
            <label className="fp2-label">Enter your account email</label>
            <input
              type="email"
              className="fp2-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn solid fp2-btn" onClick={sendOtp} disabled={loading}>
              {loading ? "Sending…" : "Send OTP"}
            </button>
            {msg && <p className="fp2-hint">{msg}</p>}
          </>
        )}

        {step === "otp" && (
          <>
            <label className="fp2-label">Enter the 6-digit code sent to your email</label>
            <input
              type="text"
              maxLength={6}
              className="fp2-input"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
            <div className="fp2-actions" style={{ display: "flex", gap: 10 }}>
              <button className="btn transparent fp2-btn-ghost" onClick={() => setStep("email")} disabled={loading}>
                Change email
              </button>
              <button className="btn solid fp2-btn" onClick={verifyOtp} disabled={loading || otp.length !== 6}>
                {loading ? "Verifying…" : "Verify OTP"}
              </button>
            </div>
            {msg && <p className="fp2-hint">{msg}</p>}
          </>
        )}

        {step === "reset" && (
          <>
            <label className="fp2-label">New password (min 8 chars)</label>
            <div className="fp2-password-wrap">
              <input
                type={showPwd ? "text" : "password"}
                className="fp2-input"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn eye-btn--inside"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? "Hide password" : "Show password"}
                title={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <div className="fp2-password-wrap">
              <input
                type={showConfirm ? "text" : "password"}
                className="fp2-input"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn eye-btn--inside"
                onClick={() => setShowConfirm((s) => !s)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                title={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button className="btn solid fp2-btn" onClick={resetWithOtp} disabled={loading}>
              {loading ? "Saving…" : "Save new password"}
            </button>
            {msg && <p className="fp2-hint">{msg}</p>}
          </>
        )}

        {step === "done" && (
          <>
            <p className="fp2-success">Password updated. Please sign in with your new password.</p>
            <button className="btn solid fp2-btn" onClick={() => navigate("/register")}>Go to Sign In</button>
          </>
        )}
      </div>
    </div>
  );
}