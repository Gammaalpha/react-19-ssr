import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import App from "../client/components/App";
import { BaseDocument } from "./BaseDocument";

export const render = (res) => {
  const { pipe, abort } = renderToPipeableStream(
    <BaseDocument>
      <App />
    </BaseDocument>,
    {
      bootstrapScripts: ["client.bundle.js"],
      onShellReady() {
        res.setHeader("Content-Type", "text/html");
        pipe(res);
      },
      onAllReady() {
        console.log("Render: All ready");
      },
      onError(err) {
        console.error(err);
        res.status(500).send("Internal server error");
        abort();
      },
    }
  );
};
