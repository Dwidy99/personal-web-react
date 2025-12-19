import App from "./App";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

if (typeof window !== "undefined") {
  (window as any).hljs = hljs;
}

const rootElement = document.getElementById("root") as HTMLElement;

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
