import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const issueRefundIfNeeded = async (order) => {
  if (
    order.paymentMethod !== "stripe" ||
    order.payment !== true ||
    order.refunded
  ) {
    return { success: true };
  }
  if (!order.stripePaymentIntentId) {
    return {
      success: false,
      message: "Missing payment reference — cannot auto-refund",
    };
  }
  try {
    const refund = await stripe.refunds.create({
      payment_intent: order.stripePaymentIntentId,
    });
    order.refunded = true;
    order.refundId = refund.id;
    order.refundedAt = new Date();
    order.refundFailed = false;
    await order.save();
    return { success: true };
  } catch (error) {
    console.error("issueRefundIfNeeded:", error);
    order.refundFailed = true;
    await order.save();

    return {
      success: false,
      message: "Refund failed",
    };
  }
};
