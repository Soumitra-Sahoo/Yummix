import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const Dashboard = () => {
  const { url, authHeader } = useContext(AdminContext);
  const [data, setData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalFoods: 0,
    totalUsers: 0,
    monthlyRevenue: [],
    recentOrders: [],
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/dashboard`, authHeader());
      if (response.data.success) setData(response.data.data);
    } catch {}
  };

  useEffect(() => {
  fetchData();
  const interval = setInterval(fetchData, 7000);
  return () => clearInterval(interval);
}, []);

  return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 30, width: "100%" }}>
      <h2 style={{ marginBottom: 25 }}>Platform Overview</h2>
      <div className="dashboard-cards">
        <div className="card"><h3>Total Revenue</h3><p>₹{data.totalRevenue.toFixed(2)}</p></div>
        <div className="card"><h3>Total Orders</h3><p>{data.totalOrders}</p></div>
        <div className="card"><h3>Total Foods</h3><p>{data.totalFoods}</p></div>
        <div className="card"><h3>Total Users</h3><p>{data.totalUsers}</p></div>
      </div>
      <div className="dashboard-bottom">
        <div className="recent-orders">
          <h3>Recent Orders</h3>
          {data.recentOrders?.map((order, index) => (
            <div key={index} className="order-card">
              <div>
                <h4>{order.items?.map((item) => item.name).join(", ")}</h4>
                <p>{order.address?.firstName} {order.address?.lastName}</p>
              </div>
              <span>₹{order.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="graph-section">
          <h3>Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.monthlyRevenue || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#f9c400" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;