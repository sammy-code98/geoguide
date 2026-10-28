/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

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
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      manifest: {
        name: "GeoGuide",
        short_name: "GeoGuide",
        description:
          "Your calm companion for exploring the world; plan itineraries, estimate costs, and discover places worth the trip.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#f8f6f1",
        theme_color: "#0f766e",
        categories: ["travel", "lifestyle"],
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,svg}",
          "*.png",
          "assets/*-latin-{,ext-}wght-*.woff2",
        ],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ url, sameOrigin }) =>
              sameOrigin &&
              /^\/assets\/.+\.(jpe?g|png|webp|avif|woff2)$/.test(url.pathname),
            handler: "CacheFirst",
            options: {
              cacheName: "geoguide-static",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: ({ url, sameOrigin }) =>
              sameOrigin &&
              /^\/api\/(countries|weather|exchange|places|locations|ai\/country)(\/|$|\?)/.test(
                url.pathname,
              ),
            handler: "NetworkFirst",
            options: {
              cacheName: "geoguide-api",
              networkTimeoutSeconds: 6,
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 3 },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\//,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "geoguide-map-tiles",
              expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 14 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ request, sameOrigin }) =>
              !sameOrigin && request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "geoguide-images",
              expiration: {
                maxEntries: 400,
                maxAgeSeconds: 60 * 60 * 24 * 30,
                purgeOnQuotaError: true,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "query-vendor": ["@tanstack/react-query"],
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET || "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
});
