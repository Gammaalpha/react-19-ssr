import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";
import EnhancedVaultClient, {
  TokenMetadata,
} from "../utils/enhanced-vault-client";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

const vaultClient = new EnhancedVaultClient();

interface User {
  id: number;
  username: string;
  email: string;
}

interface JWTPayload {
  userId: number;
  username: string;
  email: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface LoginContext {
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
  location?: string;
  sessionId?: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
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

    req.user = { id: user.id, email: user.email, username: user.username };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

/**
 * Generates access and refresh token. Also stores refresh token to the vault store whenever it is generated.
 * @param user of interface type User
 * @param metadata of interface type TokenMetadata
 * @returns
 */
export const generateTokens = async (
  user: User,
  metadata?: TokenMetadata
): Promise<TokenPair> => {
  const payload: JWTPayload = {
    userId: user.id,
    username: user.username,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  // Store refresh token in Vault with metadata
  await vaultClient.storeRefreshToken(user.username, refreshToken, metadata);

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
    };
  } catch (error) {
    return null;
  }
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

export const refreshAccessToken = async (
  username: string
): Promise<{ accessToken: string }> => {
  const storedRefreshToken = await vaultClient.getRefreshToken(username);

  if (!storedRefreshToken) {
    throw new Error("No refresh token found");
  }

  const decoded = jwt.verify(
    storedRefreshToken,
    JWT_REFRESH_SECRET
  ) as JWTPayload;

  const newAccessToken = jwt.sign(
    {
      userId: decoded.userId,
      username: decoded.username,
      email: decoded.email,
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  return { accessToken: newAccessToken };
};

export const vaultLogout = async (username: string): Promise<boolean> => {
  try {
    const deleted = await vaultClient.deleteRefreshToken(username);
    if (deleted) {
      console.log(`User ${username} logged out successfully`);
    }
    return deleted;
  } catch (error: any) {
    console.error("Logout error:", error.message);
    return false;
  }
};

/**
 * Get client IP address from request
 */
const getClientIP = (req: Request): string => {
  return (
    req.get("X-Forwarded-For")?.split(",")[0] ||
    req.get("X-Real-IP") ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    "Unknown"
  );
};

/**
 * Extract login context from Express request
 */
export const extractLoginContext = (req: Request): LoginContext => {
  return {
    ipAddress: getClientIP(req),
    userAgent: req.get("User-Agent"),
    deviceId: req.get("X-Device-ID"),
    sessionId: req.sessionID,
    // You could add geolocation lookup here
    location: req.get("X-User-Location") || "Unknown",
  };
};
