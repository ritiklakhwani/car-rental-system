import { Router } from "express";
import { prisma } from "./prisma";
import { authMiddleware } from "./middleware";
import { bookingSchema, updateBookingSchema } from "./schema";
const router = Router();

router.use(authMiddleware);

router.post("/", async (req, res) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "invalid inputs",
    });
  }

  const { carName, days, rentPerDay } = parsed.data;

  const booking = await prisma.booking.create({
    data: {
      userId: req.user!.userId,
      carName,
      days,
      rentPerDay,
      status: "booked",
    },
  });

  res.status(201).json({
    success: true,
    data: {
      message: "Booking created successfully",
      bookingId: booking.id,
      totalCost: days * rentPerDay,
    },
  });
});
router.get("/", (req, res) => {});
router.put("/", (req, res) => {});
router.delete("/", (req, res) => {});

export default router;
