import orderModel from "../models/orderModel.js";
import riderModel from "../models/riderModel.js";
import restaurantModel from "../models/restaurantModel.js";
import riderAssignmentModel from "../models/riderAssignmentModel.js";
import riderEarningsModel from "../models/riderEarningsModel.js";
import {
  haversineKm,
  assignRiderToOrder,
} from "../services/riderAssignmentService.js";

const EARNINGS_PER_KM = 4;
const BONUS_THRESHOLD = 10;
const BONUS_AMOUNT = 100;

const getAssignedOrder = async (req, res) => {
  try {
    const rider = await riderModel.findById(req.riderId);
    if (!rider?.currentOrderId) return res.json({ success: true, data: null });

    const order = await orderModel
      .findById(rider.currentOrderId)
      .populate("restaurantId", "restaurantName address location");

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("getAssignedOrder:", error);
    res.json({ success: false, message: "Error" });
  }
};

const acceptDelivery = async (req, res) => {
  try {
    const { orderId } = req.body;
    const assignment = await riderAssignmentModel.findOne({
      orderId, riderId: req.riderId, status: "pending",
    });
    if (!assignment) {
      return res.json({ success: false, message: "Assignment not found or expired" });
    }

    await riderAssignmentModel.findByIdAndUpdate(assignment._id, {
      status: "accepted",
      respondedAt: new Date(),
    });
    res.json({ success: true, message: "Delivery accepted" });
  } catch (error) {
    console.error("acceptDelivery:", error);
    res.json({ success: false, message: "Error" });
  }
};

const rejectDelivery = async (req, res) => {
  try {
    const { orderId } = req.body;
    const assignment = await riderAssignmentModel.findOne({
      orderId,
      riderId: req.riderId,
      status: "pending",
    });
    if (!assignment)
      return res.json({
        success: false,
        message: "Assignment not found or expired",
      });

    await riderAssignmentModel.findByIdAndUpdate(assignment._id, {
      status: "rejected",
      respondedAt: new Date(),
    });
    await riderModel.findByIdAndUpdate(req.riderId, {
      isAvailable: true,
      currentOrderId: null,
    });

    const order = await orderModel.findById(orderId);
    if (order?.customerLocation?.lat) {
      await assignRiderToOrder(
        orderId,
        order.customerLocation.lat,
        order.customerLocation.lng,
      );
    }

    res.json({ success: true, message: "Delivery rejected" });
  } catch (error) {
    console.error("rejectDelivery:", error);
    res.json({ success: false, message: "Error" });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const ALLOWED = ["Picked Up", "Out for Delivery", "Delivered"];
    if (!ALLOWED.includes(status))
      return res.json({ success: false, message: "Invalid status" });

    const order = await orderModel.findOne({
      _id: orderId,
      riderId: req.riderId,
    });
    if (!order) return res.json({ success: false, message: "Order not found" });

    const update = { status };
    if (status === "Delivered") update.deliveredAt = new Date();
    await orderModel.findByIdAndUpdate(orderId, update);

    if (status === "Delivered") {
      const rider = await riderModel.findById(req.riderId);

      const restaurant = await restaurantModel
        .findById(order.restaurantId)
        .select("location");

      const restLat = restaurant?.location?.lat;
      const restLng = restaurant?.location?.lng;
      const custLat = order.customerLocation?.lat;
      const custLng = order.customerLocation?.lng;

      let distanceKm = 5; 
      if (restLat && restLng && custLat && custLng) {
        distanceKm = Math.max(
          haversineKm(restLat, restLng, custLat, custLng),
          1,
        );
      }

      const baseEarning = Math.round(distanceKm * EARNINGS_PER_KM);
      const newDeliveryCount = (rider.lifetimeDeliveries || 0) + 1;
      const bonusEarning =
        newDeliveryCount % BONUS_THRESHOLD === 0 ? BONUS_AMOUNT : 0;
      const totalEarning = baseEarning + bonusEarning;

      await riderEarningsModel.create({
        riderId: req.riderId,
        orderId,
        distanceKm: parseFloat(distanceKm.toFixed(2)),
        baseEarning,
        bonusEarning,
        totalEarning,
        deliveredAt: new Date(),
      });

      await riderModel.findByIdAndUpdate(req.riderId, {
        isAvailable: true,
        currentOrderId: null,
        totalEarnings: (rider.totalEarnings || 0) + totalEarning,
        lifetimeDeliveries: newDeliveryCount,
      });

      return res.json({
        success: true,
        message: "Delivered!",
        earning: { baseEarning, bonusEarning, totalEarning, distanceKm },
      });
    }

    res.json({ success: true, message: `Status updated to ${status}` });
  } catch (error) {
    console.error("updateDeliveryStatus:", error);
    res.json({ success: false, message: "Error" });
  }
};

const getDeliveryHistory = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ riderId: req.riderId, status: "Delivered" })
      .sort({ deliveredAt: -1 })
      .limit(50);
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("getDeliveryHistory:", error);
    res.json({ success: false, message: "Error" });
  }
};

const getPendingAssignment = async (req, res) => {
  try {
    const assignment = await riderAssignmentModel
      .findOne({ riderId: req.riderId, status: "pending" })
      .populate({
        path: "orderId",
        populate: {
          path: "restaurantId",
          select: "restaurantName address location",
        },
      });
    res.json({ success: true, data: assignment });
  } catch (error) {
    console.error("getPendingAssignment:", error);
    res.json({ success: false, message: "Error" });
  }
};

export {
  getAssignedOrder,
  acceptDelivery,
  rejectDelivery,
  updateDeliveryStatus,
  getDeliveryHistory,
  getPendingAssignment,
};
