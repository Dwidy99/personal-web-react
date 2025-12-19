import App from "./App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@/assets/admin/css/style.css";
import "@/assets/admin/css/satoshi.css";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import "highlight.js/styles/github-dark.css";

// ✅ IMPORTANT: preload highlight.js BEFORE React starts
const hljsMod = await import("highlight.js");
(window as any).hljs = hljsMod.default;

const rootElement = document.getElementById("root") as HTMLElement;

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
