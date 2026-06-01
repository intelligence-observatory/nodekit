import { defineConfig } from "vite";

export default defineConfig({
  base: "/dashboard-static/",
  build: {
    outDir: "../nodekit/server/dashboard/_static",
    emptyOutDir: true,
    minify: true,
  },
});
