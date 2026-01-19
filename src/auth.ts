import { Router } from "express";
import { prisma } from "./prisma";
import { hashedPassword, comparePassword, signToken } from "./utils";
import { signupSchema } from "./schema";
const router = Router();

router.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "invalid inputs",
    });
  }

  const { username, password } = parsed.data;

  const alreadyExists = prisma.user.findUnique({ where: username });

  if (alreadyExists) {
    return res.status(409).json({
      success: false,
      error: "username already exists",
    });
  }

  const user = await prisma.user.create({
    data: { username, password: await hashedPassword(password) },
  });

  res.status(201).json({
    success: true,
    data: { message: "User created successfully", userId: user.id },
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = prisma.user.findUnique({ where: username });
  if (!user) {
    return res.status(401).json({
      success: false,
      error: "user does not exist",
    });
  }

  const matchPassword = await comparePassword(password, user.password);
  if (!matchPassword) {
    return res.status(401).json({
      success: false,
      error: "incorrect password",
    });
  }

  const token = signToken({ userId: user.id, username });

  res.status(201).json({
    success: true,
    data: { message: "Login successful", token },
  });
});

export default router;
