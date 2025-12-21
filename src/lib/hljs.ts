import hljs from "highlight.js";

export default function ensureHLJS() {
    if (typeof window !== "undefined") {
        (window as any).hljs = hljs;
    }
    return hljs;
}
