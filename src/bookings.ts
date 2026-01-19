import { Router } from "express";
import { prisma } from "./prisma";
import { authMiddleware } from "./middleware";
import { bookingSchema, updateBookingSchema } from "./schema";
const router = Router();

router.use(authMiddleware);

router.post("/", () => {});
router.get("/", () => {});
router.put("/", () => {});
router.delete("/", () => {});

export default router;
