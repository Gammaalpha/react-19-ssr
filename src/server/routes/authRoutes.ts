import express from "express";
import {
  generateTokens,
  authenticateToken,
  AuthRequest,
  extractLoginContext,
  refreshAccessToken,
} from "../middleware/auth";
import { UserModel } from "../models/User";

const authRoutes = express.Router();

const userNameGenerator = async (firstName: string, lastName: string) => {
  const userNameResultBase = `${lastName.toLocaleLowerCase()}${
    firstName.toLocaleLowerCase()[0]
  }`;

  let userNameResult = userNameResultBase;
  let userNameResultCount = 0;
  let existingUserByUserName = await UserModel.findByUserName(userNameResult);
  while (existingUserByUserName) {
    existingUserByUserName = await UserModel.findByUserName(userNameResult);
    if (existingUserByUserName) {
      userNameResultCount += 1;
      userNameResult = `${userNameResultBase}${userNameResultCount}`;
    }
  }
  return userNameResult;
};

authRoutes.post("/register", async (req, res): Promise<any> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUserByEmail = await UserModel.findByEmail(email);

    if (existingUserByEmail) {
      return res.status(409).json({ message: "User already exists" });
    }
    const generatedUserName = await userNameGenerator(firstName, lastName);

    const user = await UserModel.create(
      firstName,
      lastName,
      email,
      password,
      generatedUserName
    );
    if (!user) {
      return res.status(500).json({ message: "Failed to create user" });
    }
    const loginContext = extractLoginContext(req);
    const { accessToken } = await generateTokens(user, loginContext);

    res.cookie("username", user.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "User registered successfully",
      accessToken,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

authRoutes.post("/login", async (req, res): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await UserModel.validatePassword(
      password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const loginContext = extractLoginContext(req);
    const { accessToken } = await generateTokens(user, loginContext);

    res.cookie("username", user.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      accessToken,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

authRoutes.post("/refresh", async (req, res): Promise<any> => {
  try {
    const usernameFromCookie = req.cookies.username;

    const user = await UserModel.findByUserName(usernameFromCookie);
    if (!user) {
      return res
        .status(403)
        .json({ message: "Username not found for refresh token" });
    }
    const { accessToken } = await refreshAccessToken(user.username);

    res.json({
      accessToken,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

authRoutes.post("/logout", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (req.user) {
      await UserModel.logoutUser(req.user.username);
    }

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

authRoutes.get("/me", authenticateToken, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

export default authRoutes;
