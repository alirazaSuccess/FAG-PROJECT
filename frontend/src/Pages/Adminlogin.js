/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/admin_login.css";

export default function Adminlogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok && data.success) {
        sessionStorage.setItem("adminToken", data.token);
        sessionStorage.setItem("role", "admin"); // ✅ Save role
        sessionStorage.setItem("isAdminLoggedIn", "true");

        alert("Admin Login successful!");
        navigate("/admin");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      alert("Something went wrong!");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>ADMIN PANEL</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <a href="/admin-signup">Don’t Have an Account?</a>
      </form>
    </div>
  );
}