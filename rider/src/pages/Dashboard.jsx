import React from "react";
import { useRider } from "../context/RiderContext.jsx";
import useDashboard from "../hooks/useDashboard.js";
import StatCard from "../components/StatCard.jsx";
import EarningsChart from "../components/EarningsChart.jsx";
import CurrentOrderCard from "../components/CurrentOrderCard.jsx";
import { Package, CheckCircle, Clock, IndianRupee, Gift } from "lucide-react";

const Dashboard = () => {
  const { rider } = useRider();
  const { data, loading } = useDashboard();

  if (loading) return <DashboardSkeleton />;

  const { stats, dailyChart } = data || {};

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div>
        <h2 className="text-xl font-bold text-black">
          Hey, {rider?.name?.split(" ")[0]} 👋
        </h2>
        <p className="text-gray-400 text-sm mt-0.5">
          {rider?.isOnline
            ? "You're online and receiving orders"
            : "Go online to start receiving orders"}
        </p>
      </div>

      {/* Current Order */}
      <CurrentOrderCard />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Package size={20} />}
          label="Today's Orders"
          value={stats?.todayDeliveries ?? 0}
          color="blue"
        />
        <StatCard
          icon={<Clock size={20} />}
          label="Pending"
          value={stats?.pendingDeliveries ?? 0}
          color="orange"
        />
        <StatCard
          icon={<IndianRupee size={20} />}
          label="Today's Earnings"
          value={`₹${stats?.todayEarnings ?? 0}`}
          color="green"
        />
        <StatCard
          icon={<CheckCircle size={20} />}
          label="Total Deliveries"
          value={stats?.totalDeliveries ?? 0}
          color="purple"
        />
      </div>

      {/* Bonus Progress */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Gift size={18} className="text-brand" />
          <span className="font-semibold text-sm text-black">
            Bonus Progress
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-2">
          {stats?.nextBonusIn ?? 10} more deliveries to earn ₹100 bonus
        </p>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-brand h-2.5 rounded-full transition-all"
            style={{
              width: `${((10 - (stats?.nextBonusIn ?? 10)) / 10) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Earnings Chart */}
      <EarningsChart data={dailyChart || []} />

      {/* Monthly Summary */}
      <div className=" from-yellow-50 to-white rounded-2xl p-4 border border-yellow-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Earnings Summary
        </p>
        <div className="space-y-2">
          {[
            { label: "Today", value: stats?.todayEarnings ?? 0 },
            { label: "This Week", value: stats?.weeklyEarnings ?? 0 },
            { label: "This Month", value: stats?.monthlyEarnings ?? 0 },
            { label: "Lifetime", value: stats?.lifetimeEarnings ?? 0 },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{label}</span>
              <span className="text-sm font-bold text-black">₹{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-48" />
    <div className="h-28 bg-gray-200 rounded-2xl" />
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-20 bg-gray-200 rounded-2xl" />
      ))}
    </div>
    <div className="h-40 bg-gray-200 rounded-2xl" />
  </div>
);

export default Dashboard;
