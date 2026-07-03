import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRider } from "../context/RiderContext.jsx";
import { Bike } from "lucide-react";

const Login = () => {
  const { login, loading } = useRider();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ok = await login(form.email, form.password);

    if (ok) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        
        {/* Logo & Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-50 rounded-2xl mb-4">
            <Bike size={30} className="text-yellow-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Rider Login
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back to Yummix Delivery
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
            />
          </div>

          {/* Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-base shadow-lg shadow-yellow-200 transition-all disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          New rider?{" "}
          <Link
            to="/register"
            className="font-semibold text-yellow-600 hover:text-yellow-700"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;