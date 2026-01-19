import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./utils";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;

  if (!header) {
    res.status(401).json({
      success: false,
      error: "Authorization header missing",
    });
  }

  const token = header?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      success: false,
      error: "Token missing",
    });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    
  }



};
