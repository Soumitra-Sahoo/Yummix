import Stripe from "stripe";
import adminAlertModel from "../models/adminAlertModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const MAX_REFUND_RETRIES = 5;

const logRefundFailure = async (order, errorMessage) => {
  console.error(`[REFUND_FAILURE] order=${order._id} attempt=${order.refundRetryCount} error=${errorMessage}`);
  try {
    await adminAlertModel.create({
      type: "refund_failed",
      orderId: order._id,
      message: `Refund attempt #${order.refundRetryCount} failed: ${errorMessage}`,
    });
  } catch (e) {
    console.error("[REFUND_FAILURE] also failed to log admin alert:", e);
  }
};

const attemptRefund = async (order) => {
  if (order.paymentMethod !== "stripe" || order.payment !== true || order.refunded) {
    await order.save();
    return { refunded: order.refunded === true, attempted: false };
  }

  if (!order.stripePaymentIntentId) {
    order.refundFailed = true;
    order.refundRetryCount = (order.refundRetryCount || 0) + 1;
    order.lastRefundError = "Missing Stripe payment reference";
    if (order.refundRetryCount >= MAX_REFUND_RETRIES) order.refundNeedsManualReview = true;
    await order.save();
    await logRefundFailure(order, order.lastRefundError);
    return { refunded: false, attempted: true };
  }

  try {
    const refund = await stripe.refunds.create({ payment_intent: order.stripePaymentIntentId });
    order.refunded = true;
    order.refundId = refund.id;
    order.refundedAt = new Date();
    order.refundFailed = false;
    order.refundNeedsManualReview = false;
    await order.save();
    return { refunded: true, attempted: true };
  } catch (error) {
    order.refundFailed = true;
    order.refundRetryCount = (order.refundRetryCount || 0) + 1;
    order.lastRefundError = error.message;
    if (order.refundRetryCount >= MAX_REFUND_RETRIES) order.refundNeedsManualReview = true;
    await order.save();
    await logRefundFailure(order, error.message);
    return { refunded: false, attempted: true };
  }
};

export const retryFailedRefunds = async () => {
  const orderModel = (await import("../models/orderModel.js")).default;
  const pending = await orderModel.find({
    refundFailed: true,
    refunded: false,
    refundRetryCount: { $lt: MAX_REFUND_RETRIES },
  });

  let succeeded = 0;
  for (const order of pending) {
    const result = await attemptRefund(order);
    if (result.refunded) succeeded++;
  }
  return { checked: pending.length, succeeded };
};

export{MAX_REFUND_RETRIES, attemptRefund,  logRefundFailure, retryFailedRefunds}