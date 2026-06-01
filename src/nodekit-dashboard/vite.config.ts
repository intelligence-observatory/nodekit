import { defineConfig } from "vite";

export default defineConfig({
  base: "/dashboard-static/",
  build: {
    outDir: "../nodekit/server/dashboard/_static",
    emptyOutDir: true,
    minify: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/dashboard.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith(".css") ? "assets/dashboard.css" : "assets/[name][extname]",
      },
    },
  },
});
