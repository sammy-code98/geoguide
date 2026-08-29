/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: false,
    // Only unit/component tests under src — never the Express server.
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, ".", "src") }],
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split rarely-changing vendor libs into their own long-cacheable chunk.
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "query-vendor": ["@tanstack/react-query"],
        },
      },
    },
  },
  server: {
    // Forward API calls to the Express backend during development so the
    // frontend can use relative `/api/*` paths and secrets stay server-side.
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET || "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
});
