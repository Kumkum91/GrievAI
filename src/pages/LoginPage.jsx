import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function LoginPage({ setUserRole }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!phone || !password) {
      setError("Please enter both phone number and password.");
      return;
    }

    if (phone.length !== 10) {
      setError("Phone number must be 10 digits.");
      return;
    }

    // Simulated login: any phone starting with '9' is admin for demo
    const role = phone.startsWith("9") ? "admin" : "citizen";
    setUserRole(role);
    navigate(role === "admin" ? "/admin" : "/citizen");
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, ""); // digits only
    setPhone(val.slice(0, 10)); // max 10 digits
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#b0b0b0", // slightly darker grey
        fontFamily: "Arial",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "15px",
          width: "320px",
          boxShadow: "0 0 15px rgba(0,0,0,0.2)",
          position: "relative",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#4B4B4B", // dark grey
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Login
        </h2>

        {/* Phone Number Input */}
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
          Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="Enter 10-digit phone number"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#d1d1d1",
            color: "#4B4B4B",
            boxSizing: "border-box",
          }}
        />

        {/* Password Input */}
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
          Password
        </label>
        <div style={{ position: "relative", marginBottom: "25px" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{
              width: "100%",
              padding: "10px 35px 10px 10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: "#d1d1d1",
              color: "#4B4B4B",
              boxSizing: "border-box",
            }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#4B4B4B",
              fontSize: "16px",
            }}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </span>
        </div>

        {error && (
          <p style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}>{error}</p>
        )}

        {/* Login Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#4B4B4B",
              color: "white",
              border: "none",
              borderRadius: "50px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}