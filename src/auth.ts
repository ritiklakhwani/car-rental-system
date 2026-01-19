import { Router } from "express";
import { prisma } from "./prisma";
import { hashedPassword, comparePassword, signToken } from "./utils";
import { signupSchema } from "./schema";
const router = Router();

router.post("/signup", () => {
    
})

router.post("/signin", () => {

})

export default router


