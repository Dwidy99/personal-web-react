import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

function getPackageName(id: string) {
  const normalizedId = id.split(path.sep).join("/");
  const nodeModulesIndex = normalizedId.lastIndexOf("/node_modules/");

  if (nodeModulesIndex === -1) {
    return "";
  }

  const packagePath = normalizedId.slice(nodeModulesIndex + "/node_modules/".length);
  const parts = packagePath.split("/");

  return parts[0]?.startsWith("@") ? `${parts[0]}/${parts[1]}` : parts[0];
}

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
            const packageName = getPackageName(id);

            if (packageName === "ckeditor5" || packageName.startsWith("@ckeditor/")) {
              return "admin-editor";
            }

            if (
              packageName === "react" ||
              packageName === "react-dom" ||
              packageName === "scheduler" ||
              packageName.startsWith("@remix-run/")
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
