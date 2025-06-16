import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initialStateObj = window.__INITIAL_DATA__ || {}; // replace with redux after

  const { dbStatus } = initialStateObj;
  const databaseConnectionSuccessful = dbStatus.status === "SUCCESS";

  const { login, register, loading, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const success = isLogin
      ? await login({ email, password })
      : await register({ email, password });

    if (!success) {
      setError(isLogin ? "Invalid credentials" : "Registration failed");
    } else {
      setSuccess(isLogin ? "Login successful!" : "Registration successful!");
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="form-container">
      {databaseConnectionSuccessful ? (
        <>
          <h2>{isLogin ? "Login" : "Register"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Login" : "Register"}
            </button>
          </form>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <p style={{ textAlign: "center", marginTop: "20px" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccess("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
                width: "auto",
              }}
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </>
      ) : (
        <>
          <h2>Connection Failure</h2>
          <p>Unable to connec to database. Please contact site owners</p>
        </>
      )}
    </div>
  );
};

export default LoginForm;
