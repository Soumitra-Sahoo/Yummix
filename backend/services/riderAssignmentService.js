import riderModel from "../models/riderModel.js";
import orderModel from "../models/orderModel.js";
import riderAssignmentModel from "../models/riderAssignmentModel.js";

// Haversine formula — returns distance in km between two lat/lng points
export const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R    = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ── FIND NEAREST AVAILABLE RIDER ─────────────────────────
// Excludes riders who already rejected/timed out this order
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

  // Sort by distance from order location
  const withDistance = riders.map((r) => ({
    rider: r,
    distance: haversineKm(orderLat, orderLng, r.location.lat, r.location.lng),
  }));

  withDistance.sort((a, b) => a.distance - b.distance);
  return withDistance[0]; 
};

// ── ASSIGN RIDER TO ORDER ─────────────────────────────────
export const assignRiderToOrder = async (orderId, orderLat, orderLng) => {
  try {
    const order = await orderModel.findById(orderId);
    if (!order) return;

    // Get list of riders who already tried this order
    const previousAssignments = await riderAssignmentModel.find({
      orderId,
      status: { $in: ["rejected", "timeout"] },
    });
    const excludeIds = previousAssignments.map((a) => a.riderId);

    const result = await findNearestRider(orderLat, orderLng, excludeIds);

    if (!result) {
      // No rider available — put in queue
      await orderModel.findByIdAndUpdate(orderId, {
        isQueued: true,
        status: "Waiting for Rider",
      });
      console.log(`[Assignment] Order ${orderId} queued — no riders available`);
      return;
    }

    const { rider, distance } = result;
    const now       = new Date();
    const timeoutAt = new Date(now.getTime() + 60 * 1000); // 60 seconds

    // Create assignment record
    await riderAssignmentModel.create({
      orderId,
      riderId: rider._id,
      status: "pending",
      assignedAt: now,
      timeoutAt,
    });

    // Mark rider as unavailable
    await riderModel.findByIdAndUpdate(rider._id, {
      isAvailable: false,
      currentOrderId: orderId,
    });

    // Update order
    await orderModel.findByIdAndUpdate(orderId, {
      riderId: rider._id,
      status: "Rider Assigned",
      isQueued: false,
      assignmentTries: (order.assignmentTries || 0) + 1,
    });

    // Schedule timeout check after 60 seconds
    setTimeout(() => checkAssignmentTimeout(orderId, rider._id), 61 * 1000);
  } catch (error) {
    console.error("[assignRiderToOrder]", error);
  }
};

// ── TIMEOUT CHECK ─────────────────────────────────────────
export const checkAssignmentTimeout = async (orderId, riderId) => {
  try {
    const assignment = await riderAssignmentModel.findOne({
      orderId,
      riderId,
      status: "pending",
    });

    if (!assignment) return; // Already responded

    // Mark as timeout
    await riderAssignmentModel.findByIdAndUpdate(assignment._id, {
      status: "timeout",
      respondedAt: new Date(),
    });

    // Free the rider
    await riderModel.findByIdAndUpdate(riderId, {
      isAvailable: true,
      currentOrderId: null,
    });

    // Get order location and try next rider
    const order = await orderModel.findById(orderId);
    if (order && order.status === "Rider Assigned") {
      console.log(`[Timeout] Rider ${riderId} timed out for order ${orderId} — reassigning`);
      await assignRiderToOrder(
        orderId,
        order.customerLocation?.lat,
        order.customerLocation?.lng
      );
    }
  } catch (error) {
    console.error("[checkAssignmentTimeout]", error);
  }
};

export const processQueuedOrders = async (riderLat, riderLng) => {
  try {
    const queuedOrders = await orderModel
      .find({ isQueued: true, payment: true })
      .sort({ date: 1 }); // FIFO

    for (const order of queuedOrders) {
      if (order.customerLocation?.lat && order.customerLocation?.lng) {
        await assignRiderToOrder(
          order._id,
          order.customerLocation.lat,
          order.customerLocation.lng
        );
      }
    }
  } catch (error) {
    console.error("[processQueuedOrders]", error);
  }
};