import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors({
  origin: [
    "https://yummix-frontend.vercel.app",
    "https://yummix-admin.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.options("*", cors());
app.use(express.json());

// Proper startup
const startServer = async () => {
  try {
    await connectDB(); 

    app.use("/api/user", userRouter);
    app.use("/api/food", foodRouter);
    app.use("/images", express.static("uploads"));
    app.use("/api/cart", cartRouter);
    app.use("/api/order", orderRouter);

    app.get("/", (req, res) => res.send("API Working"));

  } catch (error) {
    console.error("Unable to start server:", error.message);
  }
};

startServer();
