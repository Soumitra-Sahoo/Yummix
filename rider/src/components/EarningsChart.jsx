import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-bold text-dark">{label}</p>
      <p className="text-green-600">₹{payload[0]?.value} earned</p>
      <p className="text-gray-400">{payload[1]?.value} deliveries</p>
    </div>
  );
};

const EarningsChart = ({ data = []}) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
    <p className="text-sm font-bold text-dark mb-4">Last 7 Days</p>
    {data.length === 0 ? (
      <div className="h-32 flex items-center justify-center text-gray-300 text-sm">
        No data yet
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barSize={18} barGap={4}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f3f4f6"
          />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "#fef9c3", radius: 6 }}
          />
          <Bar
            dataKey="earnings"
            fill="#f9c400"
            radius={[6, 6, 0, 0]}
            name="Earnings"
          />
          <Bar
            dataKey="deliveries"
            fill="#e5e7eb"
            radius={[6, 6, 0, 0]}
            name="Deliveries"
          />
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>
);

export default EarningsChart;
