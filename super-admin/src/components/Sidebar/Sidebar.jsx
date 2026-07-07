import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Store, Bike, Package, AlertTriangle, MessageSquare } from "lucide-react";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/restaurants", icon: Store, label: "Restaurants" },
  { to: "/riders", icon: Bike, label: "Riders" },
  { to: "/orders", icon: Package, label: "Orders" },
  { to: "/refund-alerts", icon: AlertTriangle, label: "Refund Alerts" },
  { to: "/feedback", icon: MessageSquare, label: "Feedback" },
];

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-option ${isActive ? "active" : ""}`}>
            <Icon size={18} />
            <p>{label}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;