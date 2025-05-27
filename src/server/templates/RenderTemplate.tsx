import React from "react";
import PropTypes from "prop-types";
import { IRenderTemplate } from "../models/RenderTemplate";

export const RenderTemplate = ({
  variables = {},
  content,
}: IRenderTemplate) => {
  return (
    <html lang={variables?.lang || "en"}>
      <head>
        <title>{variables.pageTitle || ""}</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="Content-Type" content="text/html; charSet=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta property="og:title" content={variables.pageTitle || ""} />
        <meta property="og:title" content={variables.pageDescription || ""} />
      </head>
      <body>
        <main role="main">
          <div className="root" id="root">
            {content}
          </div>
        </main>
      </body>
    </html>
  );
};

RenderTemplate.propTypes = {
  variables: PropTypes.shape({
    isProduction: PropTypes.bool,
    pageTitle: PropTypes.string,
    pageDescription: PropTypes.string,
    lang: PropTypes.string,
  }),
  content: PropTypes.node,
};
