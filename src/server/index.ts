import express, { Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import crypto from "crypto";

import { render } from "./render";
import { initDatabase } from "./database/mysql-connection";
import { ContextModel } from "./models/ContextMode";
import authRoutes from "./routes/authRoutes";
import { DatabaseStatusType } from "./models/SharedModels";
import rateLimit from "express-rate-limit";

import {
  connectMongoDBWithRetry,
  isMongoDBConnected,
  closeMongoDB,
} from "./database/mongo-connection";
import { mongoDBRouter } from "./routes/mongoDbRoutes";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.resolve(__dirname, "../build")));
app.use(express.static(path.resolve(__dirname, "../assets")));

// Generate a secure random secret for *development* only
// For production, set this in your environment variables
const SESSION_SECRET: string =
  process.env.SESSION_SECRET ?? crypto.randomBytes(64).toString("hex");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later.",
});

let dbStatus: DatabaseStatusType;
// initialize db connection
initDatabase().then((result) => {
  dbStatus = result;
});

// Middleware
app.use(
  session({
    secret: SESSION_SECRET, // Must be a long random string
    resave: false, // Don't save if session not modified
    saveUninitialized: true, // Save new sessions
    cookie: { secure: false }, // true if HTTPS only
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.disable("x-powered-by").use(express.urlencoded()).use(express.json());

app.use(express.json());
app.use(cookieParser());

// api auth routes
app.use("/api/auth", authRoutes);
app.use("/api/auth/login", authLimiter);

// mongodb route
app.use("/api", mongoDBRouter);

const mainPath = (req: Request, res: Response) => {
  // use if you want to get the route sub paths
  // const catchAllParts = req.params.catchAllParts;
  const initialState = {
    auth: {
      isAuthenticated: false,
      currentUser: null,
    },
    dbStatus,
  };
  const context: ContextModel = {};

  render(req, res, context, initialState);
};

// SSR Routes
app.get("/", mainPath);
app.get("/*catchAllParts", mainPath);

// get system health status
app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    mongoDBConneced: isMongoDBConnected,
  });
});

const startServer = async (): Promise<void> => {
  try {
    // Connect to mongodb server
    await connectMongoDBWithRetry();

    app.listen(PORT, () => {
      console.log(`App running at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server: ", error);
    process.exit(1);
  }
};

process.on("SIGNT", async (): Promise<void> => {
  console.log("\n Shutting down gracefully...");
  await closeMongoDB();
  process.exit(0);
});

startServer();
