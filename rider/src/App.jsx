import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRider } from "./context/RiderContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Orders from "./pages/Orders.jsx";
import History from "./pages/History.jsx";
import Profile from "./pages/Profile.jsx";
import Earnings from "./pages/Earnings.jsx";
import Layout from "./components/Layout.jsx";
import AssignmentAlert from "./components/AssignmentAlert.jsx";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { token } = useRider();
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const { token, pendingAssignment } = useRider();

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Global assignment alert overlay */}
      {token && pendingAssignment && <AssignmentAlert />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="history" element={<History />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
