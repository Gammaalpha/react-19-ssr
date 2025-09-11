import React from "react";
import { hydrateRoot } from "react-dom/client";
import "./styles/index.scss";
import App from "@shared/components/App";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import store from "./store";
import { Provider } from "react-redux";

const rootElement = document.getElementById("root");

if (rootElement) {
  hydrateRoot(
    rootElement,
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  );
} else {
  throw new Error("Root element not found for hydration");
}
