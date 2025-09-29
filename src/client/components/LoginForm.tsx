import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@carbon/react";

const LoginForm = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initialStateObj = window.__INITIAL_DATA__ || {}; // replace with redux after

  const { mySqlDbStatus } = initialStateObj;
  const databaseConnectionSuccessful = mySqlDbStatus.status === "SUCCESS";

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
      : await register({ firstName, lastName, email, password });

    if (!success) {
      setError(
        isLogin ? t("loginState.failed") : t("registrationState.failed")
      );
    } else {
      setSuccess(
        isLogin ? t("loginState.sucess") : t("registrationState.success")
      );
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
          <h2>{isLogin ? t("login") : t("register")}</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="firstName">{t("loginForm.firstName")}</label>
                  <input
                    type="name"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">{t("loginForm.lastName")}</label>
                  <input
                    type="name"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div className="form-group">
              <label htmlFor="email">{t("loginForm.email")}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">{t("loginForm.password")}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" kind="primary" disabled={loading}>
              {loading ? t("processing") : isLogin ? t("login") : t("register")}
            </Button>
          </form>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            {isLogin ? t("noAccount") : t("haveAccount")}
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
              {!isLogin ? t("login") : t("register")}
            </button>
          </p>
        </>
      ) : (
        <>
          <h2>{t("Connection Failure")}</h2>
          <p>{t("unableToConnect")}</p>
        </>
      )}
    </div>
  );
};

export default LoginForm;
