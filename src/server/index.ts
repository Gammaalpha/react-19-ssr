import express, { Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import { render } from "./render";
import { initDatabase } from "./database/connection";
import { ContextModel } from "./models/ContextMode";
import authRoutes from "./routes/authRoutes";
import { DatabaseStatusType } from "./models/SharedModels";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.resolve(__dirname, "../build")));
app.use(express.static(path.resolve(__dirname, "../assets")));

let dbStatus: DatabaseStatusType;
// initialize db connection
initDatabase().then((result) => {
  dbStatus = result;
});

// Middleware
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

app.listen(PORT, () => {
  console.log(`App running at: http://localhost:${PORT}`);
});
