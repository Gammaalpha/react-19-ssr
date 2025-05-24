import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import App from "../shared/App";
import { StaticRouter } from "react-router-dom";
import { htmlEnd, htmlStart } from "../shared/htmlParts";

export const render = (req, res, context, initialState) => {
  res.write(htmlStart)
  const { pipe, abort } = renderToPipeableStream(
    // <StaticRouter location={req.url} context={context}>
    //   <BaseDocument>
    //     <App initialState={initialState} />
    //   </BaseDocument>
    // </StaticRouter>,
    React.createElement(StaticRouter, { location: req.url, context }, React.createElement(App, { initialState })),
    {
      bootstrapScripts: ["client.bundle.js"],
      bootstrapScriptContent: `window.__INITIAL_DATA__ = ${JSON.stringify(initialState)}`,
      onShellReady() {
        res.setHeader("Content-Type", "text/html");
        pipe(res);
      },
      onAllReady() {
        console.log("Render: All ready");
        res.write(htmlEnd)
        res.end()
      },
      onError(err) {
        console.error('Shell error: ', err);
        // res.status(500).send("Internal server error");
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Something went wrong</h1>');
        abort();
      },
    }
  );
};
