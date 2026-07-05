import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";
import restaurantRouter from "./routes/restaurantRoute.js";
import restaurantFoodRouter from "./routes/restaurantFoodRoute.js";
import restaurantDashboardRoute from "./routes/restaurantDashboardRoute.js";
import restaurantOrderRouter from "./routes/restaurantOrderRoute.js";
import ratingRouter from "./routes/ratingRoute.js";
import riderRouter from "./routes/riderRoute.js";
import riderOrderRouter from "./routes/riderOrderRoute.js";
import riderDashboardRouter from "./routes/riderDashboardRoute.js";
import feedbackRouter from "./routes/feedbackRoute.js"
import cronRouter from "./routes/cronRoute.js";

const app = express();

app.use(
  cors({
    origin: [
      "https://yummix-frontend.vercel.app",
      "https://yummix-admin.vercel.app",
      "https://yummix-rider.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  }),
);

app.options("*", cors());
app.use(express.json());

await connectDB();

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/food", foodRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/cron", cronRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/restaurant", restaurantDashboardRoute);
app.use("/api/restaurant-food", restaurantFoodRouter);
app.use("/api/restaurant-order", restaurantOrderRouter);
app.use("/api/rating", ratingRouter);
app.use("/api/rider", riderRouter);
app.use("/api/rider-order", riderOrderRouter);
app.use("/api/rider-dashboard", riderDashboardRouter);
app.use("/api/contact", feedbackRouter);

app.get("/", (req, res) => res.send("Yummix API Working"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
