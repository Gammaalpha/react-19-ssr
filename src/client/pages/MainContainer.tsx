import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthProvider } from "@client/context/AuthContext";
import AppHeader from "../components/AppHeader";
import RecordInput from "../components/RecordInput";
import Dashboard from "../components/Dashboard";

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
            <Route
              path="/records"
              element={
                <ProtectedRoute>
                  <RecordInput />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </main>
    </>
  );
};

export default MainContainer;
