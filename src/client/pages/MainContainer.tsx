import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthProvider } from "@client/context/AuthContext";
import AppHeader from "../components/AppHeader";
import Dashboard from "../components/Dashboard";
import { navLinks } from "./routes";

const MainContainer = () => {
  // const initialStateObj = window.__INITIAL_DATA__ || {};
  // console.log(initialStateObj);
  return (
    <>
      <AppHeader />
      <main className="container">
        <h1>Hello, SSR with Express and React!</h1>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {navLinks.map((link) => (
              <Route
                path={link.slug}
                element={
                  link.isProtected ? (
                    <ProtectedRoute>{link.render}</ProtectedRoute>
                  ) : (
                    link.render
                  )
                }
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </main>
    </>
  );
};

export default MainContainer;
