/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/admin_login.css";
import "../styling/loading.css"

export default function AdminSignup() {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/admin/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();
            console.log(data);

            if (res.ok) {
                alert("Admin signup successful!");
                navigate("/admin-login");
            } else {
                alert(data.message || "Signup failed");
            }
        } catch (error) {
            alert("Something went wrong!");
            console.error(error);
        }
    };

        // 🔍 Check if admin already exists
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/admin/check");
                const data = await res.json();

                if (data.exists) {
                    navigate("/admin-login");
                } else {
                    setLoading(false); // allow signup
                }
            } catch (err) {
                console.error("Error checking admin:", err);
            }
        };
            checkAdmin();
    }, [navigate]);

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>ADMIN SIGN UP</h1>

                <input
                    type="text"
                    placeholder="Enter your User Name"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />

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

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}