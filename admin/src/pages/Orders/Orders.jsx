import React, { useEffect, useState } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets, url } from "../../assets/assets";

const Order = () => {
  const [orders, setOrders] = useState([]);

  // FETCH ORDERS
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/restaurant-orders`, {
        headers: {
          token: localStorage.getItem("restaurantToken"),
        },
      });

      if (response.data.success) {
        setOrders(response.data.data.reverse());
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // UPDATE STATUS
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${url}/api/order/restaurant-status`,
        {
          orderId,
          status: event.target.value,
        },
        {
          headers: {
            token: localStorage.getItem("restaurantToken"),
          },
        },
      );

      if (response.data.success) {
        fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="orders-page">
      {/* HEADER */}
      <div className="orders-header">
        <h2>Orders Management</h2>

        <p>Total Orders : {orders.length}</p>
      </div>

      {/* ORDERS */}
      <div className="orders-container">
        {orders.map((order, index) => (
          <div key={index} className="modern-order-card">
            {/* LEFT SIDE */}
            <div className="order-left">
              <div className="order-icon-box">
                <img src={assets.parcel_icon} alt="" />
              </div>

              <div className="order-info">
                {/* FOOD ITEMS */}
                <h3>
                  {order.items.map((item, index) =>
                    index === order.items.length - 1
                      ? `${item.name} x ${item.quantity}`
                      : `${item.name} x ${item.quantity}, `,
                  )}
                </h3>

                <div className="customer-info">
                  <h4>
                    {order.address.firstName} {order.address.lastName}
                  </h4>
                  <p>{order.address.street}</p>
                  <p>
                    {order.address.city}, {order.address.state},{" "}
                    {order.address.country}
                  </p>
                  <p>📞 {order.address.phone}</p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="order-right">
              <div className="order-stat">
                <span>Items</span>
                <h3>{order.items.length}</h3>
              </div>
              <div className="order-stat">
                <span>Total</span>
                <h3>₹{order.amount}</h3>
              </div>
              <div
                className={`status-badge ${
                  order.status === "Food Processing"
                    ? "processing"
                    : order.status === "Out for delivery"
                      ? "delivery"
                      : "delivered"
                }`}
              >
                <span className="status-dot"></span>

                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                >
                  <option value="Food Processing">Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
