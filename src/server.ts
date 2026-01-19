
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./auth";
import bookingRoutes from "./bookings";
const app = express();

dotenv.config();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/bookings", bookingRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
