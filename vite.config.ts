import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["@rollup/rollup-linux-x64-gnu"], // skip native binary
  },
  build: {
    target: "esnext",
    modulePreload: false,
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("suneditor")) {
              return "admin-editor";
            }

            if (
              id.includes("react") ||
              id.includes("scheduler") ||
              id.includes("@remix-run")
            ) {
              return "react-vendor";
            }

            return "vendor";
          }
        },
      },
    },
  },
});
