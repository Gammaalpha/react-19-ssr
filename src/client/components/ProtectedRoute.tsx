import React from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import LoginForm from "./LoginForm";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
  }

  return <AuthProvider>{children}</AuthProvider>;
};

export default ProtectedRoute;
