import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../../client/context/AuthContext";
import Dashboard from "../../client/components/Dashboard";
import LoginForm from "../../client/components/LoginForm";
import ProtectedRoute from "../../client/components/ProtectedRoute";

const App = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const initialStateObj = window.__INITIAL_DATA__ || {};
  console.log(initialStateObj);
  return (
    <div className="container">
      <h1>Hello, SSR with Express and React!</h1>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </div>
  );
};

export default App;
