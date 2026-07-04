import riderModel from "../models/riderModel.js";
import orderModel from "../models/orderModel.js";
import riderAssignmentModel from "../models/riderAssignmentModel.js";

const ASSIGNMENT_TIMEOUT_MS = 60 * 1000;

export const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const findNearestRider = async (orderLat, orderLng, excludeRiderIds = []) => {
  const riders = await riderModel.find({
    isOnline: true,
    isAvailable: true,
    verificationStatus: "approved",
    "location.lat": { $ne: null },
    "location.lng": { $ne: null },
    _id: { $nin: excludeRiderIds },
  });
  if (riders.length === 0) return null;

  const withDistance = riders.map((r) => ({
    rider: r,
    distance: haversineKm(orderLat, orderLng, r.location.lat, r.location.lng),
  }));
  withDistance.sort((a, b) => a.distance - b.distance);
  return withDistance[0];
};

export const assignRiderToOrder = async (orderId, orderLat, orderLng) => {
  try {
    const order = await orderModel.findById(orderId);
    if (!order) return;

    const previousAssignments = await riderAssignmentModel.find({
      orderId,
      status: { $in: ["rejected", "timeout"] },
    });
    const excludeIds = previousAssignments.map((a) => a.riderId);

    const result = await findNearestRider(orderLat, orderLng, excludeIds);

    if (!result) {
      await orderModel.findByIdAndUpdate(orderId, {
        isQueued: true,
        status: "Waiting for Rider",
      });
      console.log(`[Assignment] Order ${orderId} queued — no riders available`);
      return;
    }

    const { rider } = result;
    const now = new Date();
    const timeoutAt = new Date(now.getTime() + ASSIGNMENT_TIMEOUT_MS);

    await riderAssignmentModel.create({
      orderId, riderId: rider._id, status: "pending",
      assignedAt: now, timeoutAt,
    });

    await riderModel.findByIdAndUpdate(rider._id, {
      isAvailable: false,
      currentOrderId: orderId,
    });

    await orderModel.findByIdAndUpdate(orderId, {
      riderId: rider._id,
      status: "Rider Assigned",
      isQueued: false,
      assignmentTries: (order.assignmentTries || 0) + 1,
    });
  } catch (error) {
    console.error("[assignRiderToOrder]", error);
  }
};

export const processExpiredAssignments = async () => {
  const now = new Date();
  const expired = await riderAssignmentModel.find({
    status: "pending",
    timeoutAt: { $lte: now },
  });

  for (const assignment of expired) {
    await riderAssignmentModel.findByIdAndUpdate(assignment._id, {
      status: "timeout",
      respondedAt: now,
    });
    await riderModel.findByIdAndUpdate(assignment.riderId, {
      isAvailable: true,
      currentOrderId: null,
    });

    const order = await orderModel.findById(assignment.orderId);
    if (order && order.status === "Rider Assigned") {
      await assignRiderToOrder(order._id, order.customerLocation?.lat, order.customerLocation?.lng);
    }
  }
  return expired.length;
};

export const processQueuedOrders = async () => {
  try {
    const queuedOrders = await orderModel
      .find({ status: "Waiting for Rider" })
      .sort({ date: 1 });

    for (const order of queuedOrders) {
      if (order.customerLocation?.lat != null && order.customerLocation?.lng != null) {
        await assignRiderToOrder(order._id, order.customerLocation.lat, order.customerLocation.lng);
      }
    }
  } catch (error) {
    console.error("[processQueuedOrders]", error);
  }
};