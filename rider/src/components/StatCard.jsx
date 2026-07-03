import React from "react";

const COLOR_MAP = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-500" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  yellow: { bg: "bg-yellow-50", text: "text-yellow-600" },
};

const StatCard = ({ icon, label, value, color = "blue" }) => {
  const { bg, text } = COLOR_MAP[color] || COLOR_MAP.blue;
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div
        className={`w-10 h-10 ${bg} ${text} rounded-xl flex items-center justify-center mb-3`}
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

export default StatCard;
