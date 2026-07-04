import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRider } from "../context/RiderContext.jsx";
import CurrentOrderCard from "../components/CurrentOrderCard.jsx";
import DeliveryMap from "../components/DeliveryMap.jsx";
import { MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_STEPS = [
  "Rider Assigned",
  "Picked Up",
  "Out for Delivery",
  "Delivered",
];

const Orders = () => {
  const { BASE_URL, currentOrder, fetchCurrentOrder, authHeader } = useRider();
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const nextStatus = () => {
    if (!currentOrder) return null;
    const idx = STATUS_STEPS.indexOf(currentOrder.status);
    return idx >= 0 && idx < STATUS_STEPS.length - 1
      ? STATUS_STEPS[idx + 1]
      : null;
  };

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/rider-order/update-status`,
        { orderId: currentOrder._id, status },
        authHeader(),
      );
      if (res.data.success) {
        toast.success(res.data.message);
        if (res.data.earning) {
          toast.success(
            `🎉 Earned ₹${res.data.earning.totalEarning} (${res.data.earning.distanceKm.toFixed(1)}km)`,
            { autoClose: 5000 },
          );
          if (res.data.earning.bonusEarning > 0) {
            toast.success("🏆 ₹100 Bonus Unlocked! 10 deliveries milestone!", {
              autoClose: 6000,
            });
          }
        }
        await fetchCurrentOrder();
      } else {
        toast.error(res.data.message || "Failed to update delivery status");
      }
    } catch (err) {
      toast.error("Failed to update status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (!currentOrder) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
      <div className="text-7xl mb-4">🛵</div>

      <h3 className="font-bold text-2xl text-gray-800 mb-2">
        No Active Delivery
      </h3>

      <p className="text-gray-500 max-w-sm mb-6">
        Go online and accept an order to start delivering.
      </p>

      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-xl shadow-md transition-all duration-200 hover:scale-105"
      >
        View Available Orders
      </button>
    </div>
    </div>
  );
  }
  const restaurant = currentOrder.restaurantId;
  const next = nextStatus();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-dark">Active Delivery</h2>
      {/* Map */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">Live Route</h3>

          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
            Live
          </span>
        </div>

        <DeliveryMap
          restaurantLat={restaurant?.location?.lat}
          restaurantLng={restaurant?.location?.lng}
          customerLat={currentOrder.customerLocation?.lat}
          customerLng={currentOrder.customerLocation?.lng}
        />
      </div>
      {/* Restaurant Info */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <p className="text-xs text-gray-400 font-semibold uppercase mb-2">
          Pick Up From
        </p>
        <h4 className="font-bold text-dark">{restaurant?.restaurantName}</h4>
        <div className="flex items-start gap-1.5 mt-1">
          <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
          <p className="text-sm text-gray-500">{restaurant?.address}</p>
        </div>
      </div>
      {/* Customer Info */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <p className="text-xs text-gray-400 font-semibold uppercase mb-2">
          Deliver To
        </p>
        <h4 className="font-bold text-dark">
          {currentOrder.address?.firstName} {currentOrder.address?.lastName}
        </h4>
        <div className="flex items-start gap-1.5 mt-1">
          <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
          <p className="text-sm text-gray-500">
            {currentOrder.address?.street}, {currentOrder.address?.city},{" "}
            {currentOrder.address?.state} - {currentOrder.address?.pincode}
          </p>
        </div>
        <a
          href={`tel:${currentOrder.address?.phone}`}
          className="flex items-center gap-1.5 mt-2 text-brand font-semibold text-sm"
        >
          <Phone size={14} />
          {currentOrder.address?.phone}
        </a>
      </div>
      {/* Order Items */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <p className="text-xs text-gray-400 font-semibold uppercase mb-2">
          Items ({currentOrder.items?.length})
        </p>
        {currentOrder.items?.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-1">
            <span className="text-gray-700">
              {item.name} × {item.quantity}
            </span>
            <span className="font-semibold text-dark">
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}
        <div className="border-t mt-2 pt-2 flex justify-between font-bold text-sm">
          <span>Total</span>
          <span>₹{currentOrder.amount}</span>
        </div>
      </div>
      {/* Delivery Timeline */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <p className="text-xs text-gray-400 font-semibold uppercase mb-4">
          Delivery Progress
        </p>

        <div className="space-y-1">
          {STATUS_STEPS.map((step, index) => {
            const currentIndex = STATUS_STEPS.indexOf(currentOrder.status);

            const completed = index < currentIndex;
            const active = index === currentIndex;

            return (
              <div key={step} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${
                completed
                  ? "bg-green-500 text-white"
                  : active
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
                  >
                    {completed ? "✓" : active ? "●" : "○"}
                  </div>

                  {index !== STATUS_STEPS.length - 1 && (
                    <div
                      className={`w-0.5 h-10 mt-1 ${
                        index < currentIndex ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm ${
                        active
                          ? "font-bold text-black"
                          : completed
                            ? "text-gray-700"
                            : "text-gray-400"
                      }`}
                    >
                      {step}
                    </p>

                    {active && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Open in Maps */}
      {currentOrder.customerLocation?.lat && (
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${currentOrder.customerLocation.lat},${currentOrder.customerLocation.lng}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-blue-50 text-blue-600 font-semibold rounded-xl text-sm"
        >
          <Navigation size={16} />
          Open in Google Maps
        </a>
      )}
      {/* Action Button */}
      {next && (
        <button
          onClick={() => updateStatus(next)}
          disabled={updating}
          className="w-full py-4 bg-brand hover:bg-brand-dark text-dark font-bold rounded-xl shadow-md shadow-yellow-200 transition disabled:opacity-60 text-sm"
        >
          {updating ? "Updating..." : `Mark as "${next}"`}
        </button>
      )}
      {currentOrder.status === "Delivered" && (
        <div className="text-center py-4 text-green-600 font-bold text-lg">
          ✅ Delivery Completed!
        </div>
      )}
    </div>
  );
};

export default Orders;
