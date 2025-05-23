import express, { Request, Response } from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

import { render } from "./render";

app.use(express.static(path.resolve(__dirname, "../build")));
app.use(express.static(path.resolve(__dirname, "../assets")));

app.get("/", (_req: Request, res: Response) => {
  render(res);
});

app.listen(PORT, () => {
  console.log(`App running at: http://localhost:${PORT}`);
});
