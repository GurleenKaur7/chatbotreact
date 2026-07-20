
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "../styles/styles.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState({ show: false, success: false, message: "" });
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://192.168.86.27:8000/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("token", res.data.token);

      setPopup({ show: true, success: true, message: "Login Successful!" });

      // Redirect after popup animations
      setTimeout(() => {
        setPopup({ show: false, success: false, message: "" });
        router.push("/gpt");
      }, 1500);

    } catch (err) {
      console.error("Login error:", err.response?.data || err);

      setPopup({ show: true, success: false, message: "Invalid Credentials" });

      setTimeout(() => setPopup({ show: false, success: false, message: "" }), 1500);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-left">
          <img className="hero-img" src="/group112.png" alt="login" />
        </div>

        <div className="auth-right">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="primary-btn" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>

      {popup.show && (
        <div className="popup-overlay">
          <div className="popup-box">
            {popup.success && <div className="tick">✔️</div>}
            <p>{popup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}