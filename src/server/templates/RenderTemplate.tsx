import React, { ReactNode } from "react";
import PropTypes from "prop-types";

type TemplateVariables = {
  pageTitle?: string;
  pageDescription?: string;
  isProduction?: boolean;
};

interface IRenderTemplate {
  variables?: TemplateVariables;
  content: ReactNode;
}

export const RenderTemplate = ({
  variables = {},
  content,
}: IRenderTemplate) => {
  return (
    <html>
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
  }),
  content: PropTypes.node,
};
