import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// ✅ Admin styles
import "@/assets/admin/css/style.css";
import "@/assets/admin/css/satoshi.css";

// ✅ highlight theme (dipakai untuk code block result)
import "highlight.js/styles/github-dark.css";

// ✅ Quill syntax bootstrap (MUST run before any ReactQuill editor mounts)
import { setupQuillSyntax } from "@/lib/quillSyntax";
setupQuillSyntax();

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
