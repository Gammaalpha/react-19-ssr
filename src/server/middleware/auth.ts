import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeaderToken = req.headers["authorization"];

  if (!authHeaderToken) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(authHeaderToken, JWT_SECRET) as {
      id: number;
      email: string;
    };
    const user = await UserModel.findById(decoded.id);
    console.log("user", user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const generateTokens = (userId: number, email: string) => {
  const accessToken = jwt.sign({ id: userId, email }, JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: userId, email }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as {
      id: number;
      email: string;
    };
  } catch (error) {
    return null;
  }
};
