import React, { useContext } from "react";
import "./Navbar.css";
import { AdminContext } from "../../context/AdminContext.jsx";
import { ShieldCheck, LogOut } from "lucide-react";

const Navbar = () => {
  const { logout } = useContext(AdminContext);

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <ShieldCheck size={22} />
        <span>Yummix Super Admin</span>
      </div>
      <button onClick={logout}>
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
};

export default Navbar;