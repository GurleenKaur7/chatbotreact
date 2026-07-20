
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "../styles/styles.css";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // 🔔 ADDED: popup state (same as login page)
  const [popup, setPopup] = useState({
    show: false,
    success: false,
    message: "",
  });
  // 🔔 END ADDED

  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !password||!email) {
      // 🔔 ADDED: popup instead of alert
      setPopup({
        show: true,
        success: false,
        message: "Please fill all fields",
      });
      setTimeout(
        () => setPopup({ show: false, success: false, message: "" }),
        1500
      );
      // 🔔 END ADDED
      return;
    }

    try {
      const res = await axios.post(
        "http://192.168.1.101:8000/signup",
        { username, password,email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 201 || res.status === 200) {
        // 🔔 ADDED: success popup
        setPopup({
          show: true,
          success: true,
          message: "Signup Successful!",
        });

        // 🔔 ADDED: redirect after popup
        setTimeout(() => {
          setPopup({ show: false, success: false, message: "" });
          router.push("/login");
        }, 1500);
        // 🔔 END ADDED
      }
    } catch (err) {
      console.error(err);

      // 🔔 ADDED: error popup
      setPopup({
        show: true,
        success: false,
        message: "Signup Failed",
      });

      setTimeout(
        () => setPopup({ show: false, success: false, message: "" }),
        1500
      );
      // 🔔 END ADDED
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-left">
          <img className="hero-img" src="/group112.png" alt="Hero" />
        </div>

        <div className="auth-right">
          <h2>Signup</h2>

          {/* 🔔 CHANGED: added onSubmit */}
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

            {/* 🔔 CHANGED: button type submit */}
            <button className="primary-btn" type="submit">
              Signup
            </button>
          </form>
          {/* 🔔 END CHANGED */}
        </div>
      </div>

      {/* 🔔 ADDED: popup UI (same as login) */}
      {popup.show && (
        <div className="popup-overlay">
          <div className="popup-box">
            {popup.success && <div className="tick">✔️</div>}
            <p>{popup.message}</p>
          </div>
        </div>
      )}
      {/* 🔔 END ADDED */}
    </div>
  );
}