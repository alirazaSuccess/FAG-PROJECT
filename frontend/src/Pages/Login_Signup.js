/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import "../styling/login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Referral code from URL (example: ?ref=REF123456)
const urlParams = new URLSearchParams(window.location.search);
const refFromUrl = urlParams.get("ref") || "";

const Login_Signup = () => {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    number: "",
    address: "",
    city: "",
    country: "",
    referralCode: refFromUrl, // 👈 default referral code from URL
  });

  const navigate = useNavigate();

  useEffect(() => {
    const container = document.querySelector(".container");
    container?.classList.add("sign-in-form");

    document.querySelector("#sign-up-btn")?.addEventListener("click", () =>
      container?.classList.add("sign-up-mode")
    );
    document.querySelector("#sign-in-btn")?.addEventListener("click", () =>
      container?.classList.remove("sign-up-mode")
    );
  }, []);

  // 🔑 LOGIN
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        loginForm
      );
      const { token,role } = response.data;

      if (!token) {
        alert("Invalid credentials!");
        return;
      }

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("isUserLoggedIn", "true");
      sessionStorage.setItem("role", role || "user");

      navigate("/user-dashboard/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed!");
    }
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
        refCode: signupForm.referralCode?.trim() || null, // 👈 send only if referral entered
      };

      const res = await axios.post(
        "http://localhost:5000/api/users/signup",
        newUserPayload
      );
      const { token, role } = res.data;

      if (!token) {
        alert("Signup failed!");
        return;
      }

      // ✅ Same storage style as login
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role || "user"); // ✅ Save role
      sessionStorage.setItem("isUserLoggedIn", "true");

      // ✅ Redirect to payment step first
      navigate("/user-dashboard/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          {/* LOGIN */}
          <form onSubmit={handleLoginSubmit} className="sign-in-form">
            <h2 className="title">Sign In</h2>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                required
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                required
              />
            </div>
            <input type="submit" value="Login" className="btn solid" />
          </form>

          {/* SIGNUP */}
          <form onSubmit={handleSignupSubmit} className="sign-up-form">
            <h2 className="title">Sign Up</h2>
            {[
              {
                icon: "fa-user",
                field: "username",
                placeholder: "Username",
                required: true,
              },
              {
                icon: "fa-envelope",
                field: "email",
                placeholder: "Email",
                required: true,
              },
              {
                icon: "fa-lock",
                field: "password",
                placeholder: "Password",
                required: true,
              },
              {
                icon: "fa-phone",
                field: "number",
                placeholder: "Number",
                required: true,
              },
              {
                icon: "fa-home",
                field: "address",
                placeholder: "Address",
                required: true,
              },
              {
                icon: "fa-city",
                field: "city",
                placeholder: "City",
                required: true,
              },
              {
                icon: "fa-flag",
                field: "country",
                placeholder: "Country",
                required: true,
              },
              {
                icon: "fa-code",
                field: "referralCode",
                placeholder: "Referral Code (optional)",
                required: false,
              },
            ].map((input, idx) => (
              <div className="input-field" key={idx}>
                <i className={`fas ${input.icon}`}></i>
                <input
                  type="text"
                  placeholder={input.placeholder}
                  value={signupForm[input.field]}
                  required={input.required}
                  onChange={(e) =>
                    setSignupForm({
                      ...signupForm,
                      [input.field]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
            <input type="submit" value="Sign Up" className="btn solid" />
          </form>
        </div>
      </div>

      {/* Panels */}
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>Sign up to create your account and get started.</p>
            <button className="btn transparent" id="sign-up-btn">
              Sign Up
            </button>
          </div>
          <img src="./img/log.svg" className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>Already have an account? Sign in here.</p>
            <button className="btn transparent" id="sign-in-btn">
              Sign In
            </button>
          </div>
          <img src="./img/register.svg" className="image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login_Signup;