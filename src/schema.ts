import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

export const loginSchema = signupSchema;

export const bookingSchema = z.object({
    carName: z.string(),
    days: z.number().max(364),
    rentPerDay: z.number().max(2000)
});

export const updateBookingSchema = z.object({
  carName: z.string().optional(),
  days: z.number().max(364).optional(),
  rentPerDay: z.number().max(2000).optional(),
  status: z.enum(["booked","completed","cancelled"]).optional()
}); 