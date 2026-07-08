import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import authRoutes from "./auth";
import bookingRoutes from "./bookings";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/bookings", bookingRoutes);

// 404 handler for unmatched routes
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "route not found" });
});

// Centralized error handler so unexpected errors return the standard envelope
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, error: "internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
