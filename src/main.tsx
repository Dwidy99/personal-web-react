import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "../src/assets/admin/css/style.css";
import "../src/assets/admin/css/satoshi.css";
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root") as HTMLElement;

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
