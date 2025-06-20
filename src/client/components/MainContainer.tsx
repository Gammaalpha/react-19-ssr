import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import LoginForm from "./LoginForm";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "@client/context/AuthContext";
import LanguageToggle from "./LanguageToggle";

const MainContainer = () => {
  // const initialStateObj = window.__INITIAL_DATA__ || {};
  // console.log(initialStateObj);
  return (
    <div className="container">
      <h1>Hello, SSR with Express and React!</h1>
      <LanguageToggle />
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

export default MainContainer;
