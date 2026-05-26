import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";
import { url } from "../../assets/assets";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {

  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalFoods: 0,
    totalUsers: 0,
    monthlyRevenue: [],
    recentOrders: [],
  });

  const fetchDashboardData = async () => {

    try {

      const response = await axios.get(
        `${url}/api/admin/dashboard`
      );

      console.log(response.data);

      if (response.data.success) {
        setDashboardData(response.data.data);
      }

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (

    <div className="dashboard">

      <h2>Dashboard Analytics</h2>

      <div className="dashboard-cards">

        <div className="card">
          <h3>Total Revenue</h3>
          <p>₹{dashboardData.totalRevenue}</p>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <p>{dashboardData.totalOrders}</p>
        </div>

        <div className="card">
          <h3>Total Foods</h3>
          <p>{dashboardData.totalFoods}</p>
        </div>

        <div className="card">
          <h3>Total Users</h3>
          <p>{dashboardData.totalUsers}</p>
        </div>

      </div>


      <div className="dashboard-bottom">


        <div className="recent-orders">

          <div className="section-header">
            <h3>Recent Orders</h3>
          </div>

          {
            dashboardData.recentOrders?.map((order,index)=>(

              <div key={index} className="order-card">

                <div>

                  <h4>
                    {
                      order.items
                        ?.map((item)=>item.name)
                        .join(", ")
                    }
                  </h4>

                  <p>
                    {order.address?.firstName} {" "}
                    {order.address?.lastName}
                  </p>

                </div>

                <span>₹{order.amount}</span>

              </div>

            ))
          }

        </div>



        <div className="graph-section">

          <h3>Monthly Revenue</h3>

          <ResponsiveContainer width="100%" height={300}>

            <LineChart
              data={dashboardData.monthlyRevenue || []}
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#facc15"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );
};

export default Dashboard;