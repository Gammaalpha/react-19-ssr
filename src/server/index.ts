import express, { Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import { render } from "./render";
import bodyParser from "body-parser";
import { initDatabase } from "./database/connection";
import { ContextModel } from "./models/ContextMode";
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.resolve(__dirname, "../build")));
app.use(express.static(path.resolve(__dirname, "../assets")));
app.use(bodyParser.json());

// initialize db connection
initDatabase();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// api auth routes
app.use("/api/auth", authRoutes);

// SSR Routes
app.get("*", (req: Request, res: Response) => {
  const initialState = {
    auth: {
      isAuthenticated: false,
      currentUser: null,
    },
  };
  const context: ContextModel = {};

  if (context?.url) {
    return res.redirect(301, context.url);
  }

  render(req, res, context, initialState);
});

app.listen(PORT, () => {
  console.log(`App running at: http://localhost:${PORT}`);
});
