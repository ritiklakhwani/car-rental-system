import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export type userPayload = {
  userId: number;
  username: string;
};

const JWT_SECRET = process.env.jwt_secret;

if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined")
}

export const hashedPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const signToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" }) as string;
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as userPayload;
};
