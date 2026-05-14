import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();

// CORS
app.use(cors({
  origin: [
    "https://yummix-frontend.vercel.app",
    "https://yummix-admin.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  credentials: true
}));

app.options("*", cors());

app.use(express.json());

// DB connect
await connectDB();

// Routes
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => res.send("API Working"));

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;