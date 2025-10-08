/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import "../styling/login.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// 👉 Phone input
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Referral code from URL
const urlParams = new URLSearchParams(window.location.search);
const refFromUrl = urlParams.get("ref") || "";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

/** Minimal country list */
const COUNTRIES = [
  { iso2: "pk", name: "Pakistan" },
  { iso2: "in", name: "India" },
  { iso2: "ae", name: "United Arab Emirates" },
  { iso2: "us", name: "United States" },
  { iso2: "gb", name: "United Kingdom" },
];

const Login_Signup = () => {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    number: "",
    address: "",
    city: "",
    country: "",
    countryIso2: "",
    referralCode: refFromUrl,
  });

  // 🔽 NEW: show/hide toggles
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [showSignupPwd, setShowSignupPwd] = useState(false);

  // (Optional) If you still use the inline forgot panel:
  const [showForgotPwd, setShowForgotPwd] = useState(false);
  const [showForgotConfirm, setShowForgotConfirm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const container = document.querySelector(".container");
    container?.classList.add("sign-up-mode");

    const signUpBtn = document.getElementById("sign-up-btn");
    const signInBtn = document.getElementById("sign-in-btn");
    const toSignUp = () => container?.classList.add("sign-up-mode");
    const toSignIn = () => container?.classList.remove("sign-up-mode");
    signUpBtn?.addEventListener("click", toSignUp);
    signInBtn?.addEventListener("click", toSignIn);
    return () => {
      signUpBtn?.removeEventListener("click", toSignUp);
      signInBtn?.removeEventListener("click", toSignIn);
    };
  }, []);

  // 🔑 LOGIN
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/api/users/login`, loginForm);
      const { token, role } = response.data;
      if (!token) return alert("Invalid credentials!");

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("isUserLoggedIn", "true");
      sessionStorage.setItem("role", role || "user");
      navigate("/user-dashboard/dashboard");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Login failed!");
    }
  };

  // 👉 When user changes country, set iso2 & human label
  const handleCountryChange = (e) => {
    const iso2 = e.target.value;
    const meta = COUNTRIES.find((c) => c.iso2 === iso2);
    setSignupForm((f) => ({
      ...f,
      countryIso2: iso2,
      country: meta?.name || "",
    }));
  };

  // 🔑 SIGNUP
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUserPayload = {
        username: signupForm.username,
        email: signupForm.email,
        password: signupForm.password,
        number: signupForm.number,
        address: signupForm.address,
        city: signupForm.city,
        country: signupForm.country,
        countryIso2: signupForm.countryIso2?.toUpperCase() || "",
        refCode: signupForm.referralCode?.trim() || null,
      };
      const res = await axios.post(`${API_BASE}/api/users/signup`, newUserPayload);
      const { token, role } = res.data;
      if (!token) return alert("Signup failed!");

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role || "user");
      sessionStorage.setItem("isUserLoggedIn", "true");
      navigate("/user-dashboard/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed: " + (err.response?.data?.message || err.message));
    }
  };

  const phoneCountry = useMemo(() => signupForm.countryIso2 || "pk", [signupForm.countryIso2]);

  // Username regex
  const usernameValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{3,20}$/.test(signupForm.username || "");

  /* =========================
     FORGOT PASSWORD (OTP) UI
     ========================= */
  const [showForgot, setShowForgot] = useState(false);
  const [fpStep, setFpStep] = useState("email"); // email | otp | reset | done
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpTempToken, setFpTempToken] = useState("");
  const [fpPassword, setFpPassword] = useState("");
  const [fpConfirm, setFpConfirm] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpMsg, setFpMsg] = useState("");

  // now redirect to dedicated page (keeping old panel code intact as requested)
  const openForgot = () => {
    navigate("/forgot-password");
  };

  // 1) Send OTP (kept)
  const handleSendOtp = async () => {
    if (!fpEmail) return alert("Please enter your email.");
    try {
      setFpLoading(true);
      setFpMsg("");
      await axios.post(`${API_BASE}/api/users/forgot-password/otp`, { email: fpEmail.trim() });
      setFpStep("otp");
      setFpMsg("If the email exists, a 6-digit code has been sent.");
    } catch (err) {
      console.error("Send OTP error:", err);
      setFpStep("otp");
      setFpMsg("If the email exists, a 6-digit code has been sent.");
    } finally {
      setFpLoading(false);
    }
  };

  // 2) Verify OTP (kept)
  const handleVerifyOtp = async () => {
    if (!fpEmail || !fpOtp) return alert("Enter the 6-digit code.");
    try {
      setFpLoading(true);
      setFpMsg("");
      const res = await axios.post(`${API_BASE}/api/users/forgot-password/otp/verify`, {
        email: fpEmail.trim(),
        otp: fpOtp.trim(),
      });
      setFpTempToken(res.data?.tempToken || "");
      setFpStep("reset");
      setFpMsg("OTP verified. Please set a new password.");
    } catch (err) {
      console.error("Verify OTP error:", err);
      alert(err?.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setFpLoading(false);
    }
  };

  // 3) Reset (kept)
  const handleResetWithOtp = async () => {
    if (!fpPassword || fpPassword.length < 8) return alert("Password must be at least 8 characters.");
    if (fpPassword !== fpConfirm) return alert("Passwords do not match.");
    try {
      setFpLoading(true);
      setFpMsg("");
      await axios.post(`${API_BASE}/api/users/forgot-password/otp/reset`, {
        email: fpEmail.trim(),
        tempToken: fpTempToken,
        password: fpPassword,
      });
      setFpStep("done");
      setFpMsg("Password updated. You can sign in now.");
    } catch (err) {
      console.error("Reset with OTP error:", err);
      alert(err?.response?.data?.message || "Failed to reset password. Try again.");
    } finally {
      setFpLoading(false);
    }
  };

  // eye icons (SVG)
  const Eye = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path fill="currentColor" d="M12 5c5 0 9 5 9 7s-4 7-9 7-9-5-9-7 4-7 9-7zm0 2C8 7 4.7 10.9 4.2 12 4.7 13.1 8 17 12 17s7.3-3.9 7.8-5C19.3 9.9 16 7 12 7zm0 2a3 3 0 110 6 3 3 0 010-6z" />
    </svg>
  );
  const EyeOff = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path fill="currentColor" d="M2 3.3L3.3 2 22 20.7 20.7 22l-2.6-2.6A11.4 11.4 0 0112 19c-5 0-9-5-9-7a9.9 9.9 0 014.6-6.1L2 3.3zM7.1 6.2A8.6 8.6 0 003.9 12c.5 1.1 3.8 5 8.1 5 1.5 0 2.8-.4 4-.9l-1.8-1.8A4 4 0 019 12a3.9 3.9 0 01.4-1.7L7.1 6.2zM12 5c5 0 9 5 9 7 0 .9-.4 2-1.1 3l-1.4-1.4c.3-.5.5-1 .5-1.6C19 10.7 15.7 7 12 7c-.6 0-1.1.1-1.6.3L8.7 5.6A7.7 7.7 0 0112 5z" />
    </svg>
  );

  return (
    <div className="container sign-up-mode">
      <div className="forms-container">
        <div className="signin-signup">
          {/* LOGIN */}
          <form onSubmit={handleLoginSubmit} className="sign-in-form">
            <h2 className="title">Sign In</h2>

            <div className="input-field">
              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>

            {/* login password with eye */}
            <div className="input-field password-field">
              <input
                type={showLoginPwd ? "text" : "password"}
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowLoginPwd((s) => !s)}
                aria-label={showLoginPwd ? "Hide password" : "Show password"}
                title={showLoginPwd ? "Hide password" : "Show password"}
              >
                {showLoginPwd ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Forgot link (redirects to page) */}
            <div className="fp2-row">
              <button type="button" className="fp2-link" onClick={() => navigate("/forgot-password")}>
                Forgot password?
              </button>
            </div>

            <input type="submit" value="Login" className="btn solid" />
          </form>

          {/* SIGNUP */}
          <form onSubmit={handleSignupSubmit} className="sign-up-form">
            <h2 className="title">Sign Up</h2>

            {/* Username */}
            <div className={`input-field ${usernameTouched && !usernameValid ? "has-error" : ""}`}>
              <input
                type="text"
                placeholder="Username (letters + numbers)"
                value={signupForm.username}
                required
                pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{3,20}$"
                title="3–20 chars, must include letters and numbers (letters, numbers, underscore allowed)"
                onChange={(e) => {
                  setSignupForm({ ...signupForm, username: e.target.value });
                  if (!usernameTouched) setUsernameTouched(true);
                }}
                onBlur={() => setUsernameTouched(true)}
              />
            </div>

            {/* Email */}
            <div className="input-field">
              <input
                type="email"
                placeholder="Email"
                value={signupForm.email}
                required
                onChange={(e) => setSignupForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>

            {/* signup password with eye */}
            <div className="input-field password-field">
              <input
                type={showSignupPwd ? "text" : "password"}
                placeholder="Password"
                value={signupForm.password}
                required
                minLength={8}
                onChange={(e) => setSignupForm((f) => ({ ...f, password: e.target.value }))}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowSignupPwd((s) => !s)}
                aria-label={showSignupPwd ? "Hide password" : "Show password"}
                title={showSignupPwd ? "Hide password" : "Show password"}
              >
                {showSignupPwd ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Phone */}
            <div className="input-field" style={{ padding: 0, border: "none" }}>
              <div style={{ flex: 1, marginLeft: 10 }}>
                <PhoneInput
                  country={phoneCountry}
                  value={signupForm.number.replace(/^\+/, "")}
                  onChange={(val) => setSignupForm((f) => ({ ...f, number: "+" + val }))}
                  enableSearch
                  inputProps={{ required: true, name: "phone" }}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Address */}
            <div className="input-field">
              <input
                type="text"
                placeholder="Address"
                value={signupForm.address}
                required
                onChange={(e) => setSignupForm((f) => ({ ...f, address: e.target.value }))}
              />
            </div>

            {/* City */}
            <div className="input-field">
              <input
                type="text"
                placeholder="City"
                value={signupForm.city}
                required
                onChange={(e) => setSignupForm((f) => ({ ...f, city: e.target.value }))}
              />
            </div>

            {/* Country select */}
            <div className="input-field">
              <select
                value={signupForm.countryIso2}
                required
                onChange={handleCountryChange}
                style={{ background: "transparent", border: "none", width: "100%" }}
              >
                <option value="">Select Country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.iso2} value={c.iso2}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Referral */}
            <div className="input-field">
              <input
                type="text"
                placeholder="Referral Code (optional)"
                value={signupForm.referralCode}
                onChange={(e) => setSignupForm((f) => ({ ...f, referralCode: e.target.value }))}
              />
            </div>

            <input type="submit" value="Sign Up" className="btn solid" />
          </form>
        </div>
      </div>

      {/* OTP PANEL (kept intact — optional eyes added) */}
      {showForgot && (
        <div className="fp2-card">
          <h3 className="fp2-title">Reset your password</h3>
          {fpStep === "email" && (
            <>
              <label className="fp2-label">Enter your account email</label>
              <input
                type="email"
                className="fp2-input"
                placeholder="you@example.com"
                value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
              />
              <button className="btn solid fp2-btn" onClick={handleSendOtp} disabled={fpLoading}>
                {fpLoading ? "Sending…" : "Send OTP"}
              </button>
              {fpMsg && <p className="fp2-hint">{fpMsg}</p>}
            </>
          )}

          {fpStep === "otp" && (
            <>
              <label className="fp2-label">Enter the 6-digit code sent to your email</label>
              <input
                type="text"
                maxLength={6}
                className="fp2-input"
                placeholder="123456"
                value={fpOtp}
                onChange={(e) => setFpOtp(e.target.value.replace(/\D/g, ""))}
              />
              <div className="fp2-actions">
                <button className="btn transparent fp2-btn-ghost" onClick={() => setFpStep("email")} disabled={fpLoading}>
                  Change email
                </button>
                <button className="btn solid fp2-btn" onClick={handleVerifyOtp} disabled={fpLoading || fpOtp.length !== 6}>
                  {fpLoading ? "Verifying…" : "Verify OTP"}
                </button>
              </div>
              {fpMsg && <p className="fp2-hint">{fpMsg}</p>}
            </>
          )}

          {fpStep === "reset" && (
            <>
              <label className="fp2-label">New password (min 8 chars)</label>
              <div className="fp2-password-wrap">
                <input
                  type={showForgotPwd ? "text" : "password"}
                  className="fp2-input"
                  placeholder="New password"
                  value={fpPassword}
                  onChange={(e) => setFpPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="eye-btn eye-btn--inside"
                  onClick={() => setShowForgotPwd((s) => !s)}
                  aria-label={showForgotPwd ? "Hide password" : "Show password"}
                  title={showForgotPwd ? "Hide password" : "Show password"}
                >
                  {showForgotPwd ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <div className="fp2-password-wrap">
                <input
                  type={showForgotConfirm ? "text" : "password"}
                  className="fp2-input"
                  placeholder="Confirm new password"
                  value={fpConfirm}
                  onChange={(e) => setFpConfirm(e.target.value)}
                />
                <button
                  type="button"
                  className="eye-btn eye-btn--inside"
                  onClick={() => setShowForgotConfirm((s) => !s)}
                  aria-label={showForgotConfirm ? "Hide password" : "Show password"}
                  title={showForgotConfirm ? "Hide password" : "Show password"}
                >
                  {showForgotConfirm ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <button className="btn solid fp2-btn" onClick={handleResetWithOtp} disabled={fpLoading}>
                {fpLoading ? "Saving…" : "Save new password"}
              </button>
              {fpMsg && <p className="fp2-hint">{fpMsg}</p>}
            </>
          )}

          {fpStep === "done" && (
            <>
              <p className="fp2-success">Password updated. Please sign in with your new password.</p>
              <button className="btn solid fp2-btn" onClick={() => setShowForgot(false)}>Close</button>
            </>
          )}
        </div>
      )}

      {/* Panels (unchanged) */}
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>Sign up to create your account and get started.</p>
            <button className="btn transparent" id="sign-up-btn">Sign Up</button>
          </div>
          <img src="./img/log.svg" className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>Already have an account? Sign in here.</p>
            <button className="btn transparent" id="sign-in-btn">Sign In</button>
          </div>
          <img src="./img/register.svg" className="image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login_Signup;
