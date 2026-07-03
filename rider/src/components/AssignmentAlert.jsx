import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRider } from "../context/RiderContext.jsx";
import { MapPin, Package, Clock } from "lucide-react";

const AssignmentAlert = () => {
  const {
    BASE_URL,
    pendingAssignment,
    setPendingAssignment,
    fetchCurrentOrder,
    authHeader,
  } = useRider();

  const [timeLeft, setTimeLeft] = useState(60);
  const [responding, setResponding] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!pendingAssignment) return;
    setTimeLeft(60);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPendingAssignment(null); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [pendingAssignment?._id]);

  if (!pendingAssignment) return null;

  const order = pendingAssignment.orderId;
  const restaurant = order?.restaurantId;

  const respond = async (action) => {
    setResponding(true);
    try {
      const endpoint =
        action === "accept"
          ? `${BASE_URL}/api/rider-order/accept`
          : `${BASE_URL}/api/rider-order/reject`;

      const res = await axios.post(
        endpoint,
        { orderId: order._id },
        authHeader(),
      );

      if (res.data.success) {
        toast.success(
          action === "accept" ? "✅ Delivery accepted!" : "Delivery rejected",
        );
        setPendingAssignment(null);
        if (action === "accept") await fetchCurrentOrder();
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Failed to respond");
    } finally {
      setResponding(false);
    }
  };

  return (
    // Full-screen overlay
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease]">
        {/* Header */}
        <div className="bg-brand px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-dark font-bold text-lg">
              🛵 New Delivery!
            </span>
            {/* Countdown ring */}
            <div className="flex items-center gap-1.5 bg-white/30 rounded-full px-3 py-1 animate-pulse">
              <Clock size={13} className="text-dark" />
              <span className="text-dark font-bold text-sm">{timeLeft}s</span>
            </div>
          </div>
          <p className="text-dark/70 text-sm">Respond before time runs out</p>
        </div>

        <div className="p-5 space-y-4">
          {/* Restaurant */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
              <Package size={18} className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold">
                PICK UP FROM
              </p>
              <p className="text-sm font-bold text-dark">
                {restaurant?.restaurantName}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {restaurant?.address}
              </p>
            </div>
          </div>

          {/* Deliver to */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold">DELIVER TO</p>
              <p className="text-sm font-bold text-dark">
                {order?.address?.firstName} {order?.address?.lastName}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {order?.address?.city}, {order?.address?.state}
              </p>
            </div>
          </div>

          {/* Order amount */}
          <div className="bg-gray-50 rounded-xl px-4 py-2.5 flex justify-between items-center">
            <span className="text-sm text-gray-500">Order Amount</span>
            <span className="text-sm font-bold text-dark">
              ₹{order?.amount}
            </span>
          </div>

          {/* Timer bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-brand h-1.5 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => respond("reject")}
              disabled={responding}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-500 font-bold rounded-xl text-sm hover:bg-gray-50 transition disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={() => respond("accept")}
              disabled={responding}
              className="flex-1 py-3 bg-brand text-black font-bold rounded-xl text-sm shadow-md shadow-yellow-200 hover:bg-brand-dark transition disabled:opacity-50"
            >
              {responding ? "..." : "Accept Delivery"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentAlert;
