import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userPayload } from "./server";

const JWT_SECRET = process.env.jwt_secret;

if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined")
}

export const hashedPassword = async (password: string) => {
  bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  bcrypt.compare(password, hash);
};

export const signToken = (payload: object) => {
  jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as userPayload;
};
