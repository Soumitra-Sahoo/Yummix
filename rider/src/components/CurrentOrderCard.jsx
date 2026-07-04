import React from "react";
import { useRider } from "../context/RiderContext.jsx";
import { useNavigate } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";

const STATUS_COLOR = {
  "Rider Assigned": {
    bg: "bg-blue-50",
    text: "text-blue-600",
    dot: "bg-blue-500",
  },
  "Picked Up": {
    bg: "bg-orange-50",
    text: "text-orange-600",
    dot: "bg-orange-500",
  },
  "Out for Delivery": {
    bg: "bg-purple-50",
    text: "text-purple-600",
    dot: "bg-purple-500",
  },
  Delivered: { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
};

const CurrentOrderCard = () => {
  const { currentOrder } = useRider();
  const navigate = useNavigate();

  if (!currentOrder) return null;

  const sc =
    STATUS_COLOR[currentOrder.status] || STATUS_COLOR["Rider Assigned"];

  return (
    <button
      onClick={() => navigate("/orders")}
      className="w-full bg-linear-to-br from-yellow-50 to-white rounded-2xl p-4 border border-yellow-200 shadow-sm text-left hover:shadow-md transition"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
            <Package size={18} className="text-dark" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-0.5">
              ACTIVE DELIVERY
            </p>
            <p className="text-sm font-bold text-dark line-clamp-1">
              {currentOrder.items?.map((i) => i.name).join(", ")}
            </p>
          </div>
        </div>
        <ArrowRight size={18} className="text-gray-400 shrink-0" />
      </div>

      <div
        className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
        {currentOrder.status}
      </div>
    </button>
  );
};

export default CurrentOrderCard;
