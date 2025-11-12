import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import "../src/assets/admin/css/style.css";
import "../src/assets/admin/css/satoshi.css";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
