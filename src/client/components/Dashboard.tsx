import React from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.module.scss";
import { useTranslation } from "react-i18next";
import { Button } from "@carbon/react";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  return (
    <div>
      <div className="nav">
        <h2>{t("dashboard")}</h2>
        <div className="dashboard-line">
          <span>{t("welcome", { email: user?.email })}</span>
          <Button
            kind="danger--tertiary"
            onClick={logout}
            className="logout-btn"
          >
            {t("logout")}
          </Button>
        </div>
      </div>
      <div className="container">
        <h3>{t("protectedContent")}</h3>
        <p>{t("protectedRouteDesc")}</p>
        <p>
          {t("userId")} {user?.id}
        </p>
        <p>
          {t("loginForm.email")} {user?.email}
        </p>

        <div className="auth-field">
          <h4>{t("authInfo")}</h4>
          <p>✅ {t("authSuccess")}</p>
          <p>🔐 {t("jwtTokenSession")}</p>
          <p>🔄 {t("accessTokenRefreshDesc")}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
