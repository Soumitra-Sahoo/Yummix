import riderModel from "../models/riderModel.js";
import riderEarningsModel from "../models/riderEarningsModel.js";
import orderModel from "../models/orderModel.js";

const BONUS_THRESHOLD = 10;

const getRiderDashboard = async (req, res) => {
  try {
    const rider = await riderModel.findById(req.riderId).select("-password");
    if (!rider) return res.json({ success: false, message: "Rider not found" });

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const todayEarnings = await riderEarningsModel.find({
      riderId: req.riderId,
      deliveredAt: { $gte: todayStart },
    });

    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 6);
    const weeklyEarnings = await riderEarningsModel.find({
      riderId: req.riderId,
      deliveredAt: { $gte: weekStart },
    });

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyEarnings = await riderEarningsModel.find({
      riderId: req.riderId,
      deliveredAt: { $gte: monthStart },
    });

    const allEarnings = await riderEarningsModel
      .find({ riderId: req.riderId })
      .sort({ deliveredAt: 1 });

    const sumEarnings = (arr) => arr.reduce((s, e) => s + e.totalEarning, 0);

    const pendingCount = await orderModel.countDocuments({
      riderId: req.riderId,
      status: { $in: ["Rider Assigned", "Picked Up", "Out for Delivery"] },
    });

    const todayDeliveries = await orderModel.countDocuments({
      riderId: req.riderId,
      status: "Delivered",
      deliveredAt: { $gte: todayStart },
    });

    const dailyChart = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dayEarnings = allEarnings.filter(
        (e) => e.deliveredAt >= dayStart && e.deliveredAt <= dayEnd,
      );
      dailyChart.push({
        day: dayStart.toLocaleDateString("en-IN", { weekday: "short" }),
        earnings: sumEarnings(dayEarnings),
        deliveries: dayEarnings.length,
      });
    }

    res.json({
      success: true,
      data: {
        rider,
        stats: {
          todayEarnings: sumEarnings(todayEarnings),
          weeklyEarnings: sumEarnings(weeklyEarnings),
          monthlyEarnings: sumEarnings(monthlyEarnings),
          lifetimeEarnings: rider.totalEarnings,
          todayDeliveries,
          pendingDeliveries: pendingCount,
          totalDeliveries: rider.lifetimeDeliveries,
          nextBonusIn:
            BONUS_THRESHOLD - (rider.lifetimeDeliveries % BONUS_THRESHOLD),
        },
        dailyChart,
      },
    });
  } catch (error) {
    console.error("getRiderDashboard:", error);
    res.json({ success: false, message: "Dashboard Error" });
  }
};

export { getRiderDashboard };
