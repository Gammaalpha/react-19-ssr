import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import App from "@shared/components/App";
import { StaticRouter } from "react-router-dom";
import { RenderTemplate } from "./templates/RenderTemplate";
import { ChunksManager } from "./utils/chunks-manager";
import path from 'path';
import fs from 'fs';

// Load webpack stats
const loadWebpackStats = () => {
  try {
    const statsPath = path.resolve(__dirname, './webpack-stats.json');
    const statsContent = fs.readFileSync(statsPath, 'utf8');
    return JSON.parse(statsContent);
  } catch (error) {
    console.error('Failed to load webpack stats:', error);
    return null;
  }
};

const isDevelopment = process.env.NODE_ENV === 'development';

export const render = (req, res, context, initialState) => {
  const stats = loadWebpackStats();

  if (!stats) {
    res.status(500).send('Failed to load webpack stats');
    return;
  }

  const chunksManager = new ChunksManager(stats, isDevelopment)

  const allScriptAssets = chunksManager.getJavaScriptAssets();

  const { pipe, abort } = renderToPipeableStream(
    RenderTemplate({
      variables: {
        pageTitle: 'React 19 SSR with JWT',
        pageDescription: 'React 19 SSR template which uses JWT for authentication'
      },
      content: React.createElement(StaticRouter, { location: req.url, context }, React.createElement(App))
    }),
    {
      bootstrapScripts: allScriptAssets,
      bootstrapScriptContent: `window.__INITIAL_DATA__ = ${JSON.stringify(initialState)}`,
      onShellReady() {
        if (!res.headersSent) {
          res.setHeader('content-type', 'text/html');
          res.status(200);
        }
        pipe(res);
      },
      onAllReady() {
        console.log("Render: All ready");
      },
      onShellError(error) {
        if (!res.headersSent) {
          res.status(500).send("Internal server error");
          res.statusCode = 500;
        }
        res.send('<!doctype html>')
        res.end('<h1>Something went wrong</h1>', err.message || err);
      },
      onError(err) {
        console.error('Shell error: ', err);
        abort();
      },
    }
  );
};
