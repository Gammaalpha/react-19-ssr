import React from "react";
import { hydrateRoot } from "react-dom/client";
import "./styles/index.scss";
import App from "@shared/components/App";

const rootElement = document.getElementById("root");
if (rootElement) {
  hydrateRoot(rootElement, <App />);
} else {
  throw new Error("Root element not found for hydration");
}
