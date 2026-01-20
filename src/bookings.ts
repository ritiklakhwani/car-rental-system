import { Router } from "express";
import { prisma } from "./prisma";
import { authMiddleware } from "./middleware";
import { bookingSchema, updateBookingSchema } from "./schema";
const router = Router();

router.use(authMiddleware);

//create booking
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
router.get("/", async (req, res) => {
  const { bookingId, summary } = req.query;

  //summary
  if (summary === "true") {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user?.userId,
        status: { in: ["booked", "completed"] },
      },
    });

    const totalBookings = bookings.length;
    let totalAmountSpent = 0;
    bookings.forEach((b) => {
      const cost = b.days * b.rentPerDay;
      totalAmountSpent += cost;
    });

    return res.status(200).json({
      success: true,
      data: {
        userId: req.user!.userId,
        username: req.user!.username,
        totalBookings,
        totalAmountSpent,
      },
    });
  }

  //single booking
  if (bookingId) {
    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
    });
    if (!booking)
      return res
        .status(404)
        .json({ success: false, error: "bookingId not found" });
    if (booking.userId !== req.user!.userId)
      return res
        .status(403)
        .json({ success: false, error: "booking does not belong to user" });

    return res.json({
      success: true,
      data: {
        ...booking,
        totalCost: booking.days * booking.rentPerDay,
      },
    });
  }

  //allbookings
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user!.userId },
  });
  const data = bookings.map((b) => ({
    ...b,
    totalCost: b.days * b.rentPerDay,
  }));
  res.json({
    success: true,
    data,
  });
});

//update booking
router.put("/:bookingId", async (req, res) => {
  const bookingId = req.params.bookingId;

  const booking = await prisma.booking.findUnique({
    where: { id: Number(bookingId) },
  });
  if (!booking)
    return res.status(404).json({ success: false, error: "booking not found" });
  if (booking.userId !== req.user!.userId)
    return res
      .status(403)
      .json({ success: false, error: "booking does not belong to user" });

  const parsed = updateBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: "invalid inputs" });
  }
  const updated = await prisma.booking.update({
    where: { id: Number(bookingId) },
    data: {
      carName: parsed.data.carName ?? booking.carName,
      days: parsed.data.days ?? booking.days,
      rentPerDay: parsed.data.rentPerDay ?? booking.rentPerDay,
      status: parsed.data.status ?? booking.status,
    },
  });

  res.json({
    success: true,
    data: {
      message: "Booking updated successfully",
      booking: { ...updated, totalCost: updated.days * updated.rentPerDay },
    },
  });
});

// delete booking
router.delete("/", (req, res) => {});

export default router;
