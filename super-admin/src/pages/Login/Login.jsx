import React, { useContext, useState } from "react";
import "./Login.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext.jsx";

const Login = () => {
  const { url, setToken } = useContext(AdminContext);
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/admin/login`, data);
      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-form" onSubmit={onSubmitHandler}>
        <h2>Super Admin Login</h2>
        <input type="email" name="email" placeholder="Email" value={data.email} onChange={onChangeHandler} required />
        <input type="password" name="password" placeholder="Password" value={data.password} onChange={onChangeHandler} required />
        <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>
    </div>
  );
};

export default Login;