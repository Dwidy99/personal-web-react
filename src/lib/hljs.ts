// src/lib/hljs.ts
import hljs from "highlight.js";

declare global {
    interface Window {
        hljs?: typeof hljs;
    }
}

// Attach once, early.
if (typeof window !== "undefined" && !window.hljs) {
    window.hljs = hljs;
}

export default hljs;
