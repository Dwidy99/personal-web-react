// src/main.tsx
import "@/lib/hljs"; // ✅ MUST be first (before any react-quill import happens anywhere)

import App from "./App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@/assets/admin/css/style.css";
import "@/assets/admin/css/satoshi.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
