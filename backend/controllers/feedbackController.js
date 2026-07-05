import feedbackModel from "../models/feedbackModel.js";

const submitFeedback = async (req, res) => {
  try {
    await feedbackModel.create({ type: "feedback", ...req.body });
    res.json({ success: true, message: "Feedback received" });
  } catch (error) {
    console.error("submitFeedback:", error);
    res.json({ success: false, message: "Failed to submit feedback" });
  }
};

const submitPartnerRequest = async (req, res) => {
  try {
    await feedbackModel.create({ type: "partner", ...req.body });
    res.json({ success: true, message: "Partner request received" });
  } catch (error) {
    console.error("submitPartnerRequest:", error);
    res.json({ success: false, message: "Failed to submit request" });
  }
};

export { submitFeedback, submitPartnerRequest };