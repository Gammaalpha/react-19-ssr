import React from "react";
// import App from "../shared/App";
import { hydrateRoot } from "react-dom/client";
import App from "./components/App";
const rootElement = document.getElementById("root");
if (rootElement) {
  hydrateRoot(rootElement, <App />);
} else {
  throw new Error("Root element not found for hydration");
}
