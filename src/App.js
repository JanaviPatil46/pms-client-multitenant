import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./Dashboard";
import LoginPage from "./login-signup/Signin";

import ForgotPassword from "./login-signup/ForgotPassword";
import ResetPassword from "./login-signup/ResetPassword";
import UpdatePassword from "./login-signup/ActivateAccount";

// pages
import Home from "./pages/Home";
import ProtectedRoute from "./context/ProtecteRoute";
import Document from "./pages/Document/Document";
import ChatTasks from "./pages/Chat&Tasks/ChatTasks";
import Organizers from "./pages/Organizers/Organizers";
import Proposals from "./pages/Proposals/Proposals";
import Invoice from "./pages/Billing/Invoice"
import Settings from "./pages/Settings";
const App = () => {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/updatepassword/:token" element={<UpdatePassword />} />

      {/* DASHBOARD LAYOUT */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route
          path="home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="document"
          element={
            <ProtectedRoute>
            <Document/>
            </ProtectedRoute>
          }
        />
        <Route
          path="chatstasks"
          element={
            <ProtectedRoute>
              <ChatTasks/>
            </ProtectedRoute>
          }
        />
        <Route
          path="organizers"
          element={
            <ProtectedRoute>
              <Organizers/>
            </ProtectedRoute>
          }
        />
        <Route
          path="proposalsels"
          element={
            <ProtectedRoute>
              <Proposals/>
            </ProtectedRoute>
          }
        />
        <Route
          path="billing"
          element={
            <ProtectedRoute>
             <Invoice/>
                         </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
             <Settings/>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* default */}
      <Route path="/" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default App;
