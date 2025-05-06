import React from "react";
import App from "./components/App";
import { hydrateRoot } from "react-dom/client";
const rootElement = document.getElementById("root");
if (rootElement) {
  hydrateRoot(rootElement, <App />);
} else {
  throw new Error("Root element not found for hydration");
}
