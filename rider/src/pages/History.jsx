import React from "react";
import useHistory from "../hooks/useHistory.js";
import { CheckCircle, MapPin, IndianRupee } from "lucide-react";

const History = () => {
  const { orders, loading } = useHistory();

  if (loading) return <HistorySkeleton />;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-center space-y-3">
        <div className="text-5xl">📦</div>
        <h3 className="font-bold text-dark text-lg">No deliveries yet</h3>
        <p className="text-gray-400 text-sm">
          Your completed deliveries will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-dark">Delivery History</h2>
        <span className="text-sm text-gray-400 font-medium">
          {orders.length} deliveries
        </span>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-dark">
                    {order.items?.map((i) => i.name).join(", ").slice(0, 30)}
                    {order.items?.length > 1 ? "..." : ""}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.deliveredAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                Delivered
              </span>
            </div>

            <div className="flex items-start gap-1.5 mt-2">
              <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-400">
                {order.address?.street}, {order.address?.city}
              </p>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
              <span className="text-xs text-gray-400">
                {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-1 text-sm font-bold text-dark">
                <IndianRupee size={13} />
                {order.amount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HistorySkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
    ))}
  </div>
);

export default History;