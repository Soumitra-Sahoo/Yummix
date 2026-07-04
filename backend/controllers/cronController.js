import { processExpiredAssignments, processQueuedOrders } from "../services/riderAssignmentService.js";

const runAssignmentSweep = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const timedOut = await processExpiredAssignments();
    await processQueuedOrders();
    res.json({ success: true, timedOut });
  } catch (error) {
    console.error("[cron:process-assignments]", error);
    res.status(500).json({ success: false, message: "Cron sweep failed" });
  }
};

export { runAssignmentSweep };