import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useRider } from "../context/RiderContext.jsx";
import {
  LayoutDashboard,
  Package,
  History,
  IndianRupee,
  User,
  LogOut,
  Bike,
} from "lucide-react";

const NAV = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/orders", icon: Package, label: "Orders" },
  { to: "/history", icon: History, label: "History" },
  { to: "/earnings", icon: IndianRupee, label: "Earnings" },
  { to: "/profile", icon: User, label: "Profile" },
];

const Layout = () => {
  const { rider, logout, toggleOnline } = useRider();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bike size={22} className="text-yellow-500" />
            <span className="font-bold text-dark text-lg">Yummix Rider</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleOnline}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                rider?.isOnline
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${rider?.isOnline ? "bg-green-500" : "bg-gray-400"}`}
              />
              {rider?.isOnline ? "Online" : "Offline"}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
        <div className="max-w-lg mx-auto flex">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "text-yellow-500"
                    : "text-gray-400 hover:text-gray-600"
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
