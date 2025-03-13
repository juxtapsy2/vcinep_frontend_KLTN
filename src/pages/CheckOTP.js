import React, { useState, useEffect } from "react";
import * as AuthAPI from "../api/AuthAPI.js";
import { useNavigate } from "react-router-dom";

function CheckOTP() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await AuthAPI.checkOTP({ email, otp });
      setMessage(response.message);
      if (response.success === true) {
        navigate("/login");
      }
      console.log("OTP check successful:", response);
    } catch (err) {
      setMessage("OTP không chính xác hoặc đã hết hạn");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div>
      <h2>Nhập OTP</h2>
      <div>{message && <div style={{ color: "green" }}>{message}</div>}</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="otp">OTP (6 chữ số):</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
        </div>
        <button type="submit" disabled={loading || timeLeft === 0}>
          {loading ? "Đang kiểm tra..." : "Xác nhận OTP"}
        </button>
      </form>
      <div>
        {timeLeft > 0 ? (
          <p>Thời gian còn lại: {formatTime(timeLeft)}</p>
        ) : (
          <p>Thời gian nhập OTP đã hết hạn!</p>
        )}
      </div>
    </div>
  );
}

export default CheckOTP;
