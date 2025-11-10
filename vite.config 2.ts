import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  // Base URL for GitHub Pages (repository deployment) - only in production
  base: process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES ? '/dream-analyser/' : '/',
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    // Set output directory relative to client directory (root)
    outDir: "../client-build",
    emptyOutDir: true,
    assetsDir: 'assets',
    // Ensure GitHub Pages can properly serve the app
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
