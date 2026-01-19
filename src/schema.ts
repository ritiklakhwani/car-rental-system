import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

export const bookingSchema = z.object({
    carName: z.string(),
    days: z.number().max(364),
    rentPerDay: z.number().max(2000)
});
