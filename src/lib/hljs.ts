// src/lib/hljs.ts
import hljs from "highlight.js";

/**
 * Attach hljs to window for Quill Syntax module.
 * Safe to call multiple times.
 */
export function ensureHLJS() {
    if (typeof window !== "undefined") {
        (window as any).hljs = (window as any).hljs ?? hljs;
    }
    return hljs;
}

export default hljs;
