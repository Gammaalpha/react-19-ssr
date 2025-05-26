import React from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.module.scss";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <div className="nav">
        <h2>Dashboard</h2>
        <div>
          <span>Welcome, {user?.email}!</span>
          <button onClick={logout} style={{ marginLeft: "15px" }}>
            Logout
          </button>
        </div>
      </div>
      <div className="container">
        <h3>Protected Content</h3>
        <p>This is a protected route that requires authentication.</p>
        <p>User ID: {user?.id}</p>
        <p>Email: {user?.email}</p>

        <div className="auth-field">
          <h4>Authentication Info</h4>
          <p>✅ You are successfully authenticated!</p>
          <p>🔐 Your session is protected with JWT tokens</p>
          <p>🔄 Access tokens are automatically refreshed</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
