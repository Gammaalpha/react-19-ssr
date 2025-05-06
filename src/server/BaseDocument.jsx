import React from "react";

// eslint-disable-next-line
export const BaseDocument = ({ children }) => {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>React 19 SSR with bootstrapScripts and typescript</title>
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
};
