import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext.jsx";
import Login from "./pages/Login/Login.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Restaurants from "./pages/Restaurants/Restaurants.jsx";
import Riders from "./pages/Riders/Riders.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import RefundAlerts from "./pages/RefundAlerts/RefundAlerts.jsx";
import Feedback from "./pages/Feedback/Feedback.jsx";
import "./App.css";

const App = () => {
  const { token } = useContext(AdminContext);

  if (!token) {
    return (
      <>
        <ToastContainer />
        <Login />
      </>
    );
  }

  return (
    <div className="app">
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/riders" element={<Riders />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/refund-alerts" element={<RefundAlerts />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;