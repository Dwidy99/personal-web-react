import hljs from "highlight.js";

/**
 * Quill Syntax module requires window.hljs to exist BEFORE the editor is created.
 * This file must be imported at app entry (main.tsx) and also by the editor component for safety.
 */
export function setupQuillSyntax() {
    if (typeof window !== "undefined") {
        (window as any).hljs = hljs;
    }
}

export default hljs;
