import React from "react";
import { hydrateRoot } from "react-dom/client";
import "./styles/index.scss";
import App from "@shared/components/App";
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root");
console.log("render client index");

if (rootElement) {
  hydrateRoot(
    rootElement,
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
} else {
  throw new Error("Root element not found for hydration");
}
