import React from "react";
import useDashboard from "../hooks/useDashboard.js";
import EarningsChart from "../components/EarningsChart.jsx";
import { IndianRupee, TrendingUp, Gift, Wallet } from "lucide-react";

const EarningCard = ({ label, value, icon, color }) => {
  const colors = {
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}
      >
        {icon}
      </div>
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-bold text-dark mt-1">{value}</p>
    </div>
  );
};

const Earnings = () => {
  const { data, loading } = useDashboard();

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-48 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  const { stats, dailyChart } = data || {};

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-dark">Earnings</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <EarningCard
          label="Today"
          value={`₹${stats?.todayEarnings ?? 0}`}
          icon={<IndianRupee size={18} />}
          color="green"
        />
        <EarningCard
          label="This Week"
          value={`₹${stats?.weeklyEarnings ?? 0}`}
          icon={<TrendingUp size={18} />}
          color="blue"
        />
        <EarningCard
          label="This Month"
          value={`₹${stats?.monthlyEarnings ?? 0}`}
          icon={<Wallet size={18} />}
          color="purple"
        />
        <EarningCard
          label="Lifetime"
          value={`₹${stats?.lifetimeEarnings ?? 0}`}
          icon={<Gift size={18} />}
          color="yellow"
        />
      </div>

      {/* Chart */}
      <EarningsChart data={dailyChart || []} />

      {/* Earning Rate Info */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <p className="text-sm font-bold text-dark mb-3">Earning Structure</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Per km rate</span>
            <span className="font-semibold text-dark">₹4 / km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery bonus</span>
            <span className="font-semibold text-dark">
              ₹100 every 10 deliveries
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Next bonus in</span>
            <span className="font-semibold text-brand">
              {stats?.nextBonusIn ?? 10} deliveries
            </span>
          </div>
        </div>
      </div>

      {/* Payout Button — UI only */}
      <div className="bg-gradient-to-br from-yellow-50 to-white rounded-2xl p-5 border border-yellow-100 text-center">
        <p className="text-sm text-gray-500 mb-1">Available for withdrawal</p>
        <p className="text-3xl font-bold text-dark mb-4">
          ₹{stats?.lifetimeEarnings ?? 0}
        </p>
        <button
          className="w-full py-3 bg-brand text-dark font-bold rounded-xl shadow-md shadow-yellow-200 opacity-60 cursor-not-allowed text-sm"
          disabled
          title="Payout coming soon"
        >
          Withdraw Earnings (Coming Soon)
        </button>
        <p className="text-xs text-gray-400 mt-2">
          Payouts will be processed weekly via UPI/Bank transfer
        </p>
      </div>
    </div>
  );
};

export default Earnings;
