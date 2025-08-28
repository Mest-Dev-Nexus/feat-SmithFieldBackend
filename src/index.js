import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import mongoose from "mongoose";
import { userRouter } from "./routes/user.js";
import { categoryRouter } from "./routes/category.js";
import { farmerProductRouter } from "./routes/farmer.js";
import { productRouter } from "./routes/products.js";
import { orderRouter } from "./routes/order.js";
import { subscriptionRouter } from "./routes/subscription.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect to MongoDB
await mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to SmithField-API"))
  .catch((err) => console.error("MongoDB connection error:", err));

//Routes
app.use("/api", userRouter);
app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use("/api", farmerProductRouter);
app.use("/api", orderRouter);
app.use("/api", subscriptionRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
