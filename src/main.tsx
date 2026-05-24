import App from "./App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const CHUNK_RELOAD_KEY = "portfolio:chunk-reload-attempted-at";
const CHUNK_RELOAD_COOLDOWN = 60_000;

function isChunkLoadError(reason: unknown) {
  const message = reason instanceof Error ? reason.message : String(reason ?? "");

  return /failed to fetch dynamically imported module|importing a module script failed|error loading dynamically imported module|expected a javascript-or-wasm module script/i.test(
    message
  );
}

window.addEventListener("unhandledrejection", (event) => {
  if (!isChunkLoadError(event.reason)) {
    return;
  }

  const lastReloadAttempt = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);

  if (Date.now() - lastReloadAttempt < CHUNK_RELOAD_COOLDOWN) {
    return;
  }

  sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
  window.location.reload();
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
