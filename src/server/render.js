import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import App from "../shared/App";
// import App from "../client/components/App";
import { StaticRouter } from "react-router-dom";
import { htmlEnd, htmlStart } from "../shared/htmlParts";
import { BaseDocument } from "../shared/BaseDocument";

export const render = (req, res, context, initialState) => {
  // res.write(htmlStart) // type 1
  const { pipe, abort } = renderToPipeableStream(
    // type 2
    <StaticRouter location={req.url} context={context}>
      <BaseDocument>
        <App initialState={initialState} />
      </BaseDocument>
    </StaticRouter>,
    // type 3
    // React.createElement(StaticRouter, { location: req.url, context }, React.createElement(App, { initialState })),
    {
      bootstrapScripts: ["client.bundle.js"],
      bootstrapScriptContent: `window.__INITIAL_DATA__ = ${JSON.stringify(initialState)}`,
      onShellReady() {
        // res.setHeader("Content-Type", "text/html");
        pipe(res);
      },
      onAllReady() {
        console.log("Render: All ready");
        // res.write(htmlEnd) // type 1
        // res.end() // type 1
      },
      onError(err) {
        console.error('Shell error: ', err);
        res.status(500).send("Internal server error");
        res.statusCode = 500;
        res.end('<h1>Something went wrong</h1>', err.message || err);
        abort();
      },
    }
  );
};
