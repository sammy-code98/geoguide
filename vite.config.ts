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
      // The app asks before swapping in a new version (see PwaPrompt), so a
      // half-filled itinerary form never reloads out from under someone.
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
          { src: "maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // App shell only (code, styles, icons, Latin fonts), so the UI opens
        // with no network without a multi-megabyte first install. Photos and
        // other font subsets are cached the first time they're shown (below).
        globPatterns: ["**/*.{js,css,html,ico,svg}", "*.png", "assets/*-latin-{,ext-}wght-*.woff2"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: "/index.html",
        // API calls are never answered with the HTML shell.
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Our own hashed images and fonts: the filename changes when the
            // content does, so a cached copy never goes stale.
            urlPattern: ({ url, sameOrigin }) =>
              sameOrigin && /^\/assets\/.+\.(jpe?g|png|webp|avif|woff2)$/.test(url.pathname),
            handler: "CacheFirst",
            options: {
              cacheName: "geoguide-static",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            // Reference data people have already looked at (countries, weather,
            // rates, places, insights) stays readable offline. Fresh data wins
            // whenever the network answers in time. Only GETs are matched, so
            // AI generation and other POSTs always go to the server.
            urlPattern: ({ url, sameOrigin }) =>
              sameOrigin &&
              /^\/api\/(countries|weather|exchange|places|locations|ai\/country)(\/|$|\?)/.test(url.pathname),
            handler: "NetworkFirst",
            options: {
              cacheName: "geoguide-api",
              networkTimeoutSeconds: 6,
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 3 },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            // Map tiles already viewed, so a revisited country still has its map.
            urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\//,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "geoguide-map-tiles",
              expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 14 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Flags, place photos, weather icons and other remote images.
            urlPattern: ({ request, sameOrigin }) => !sameOrigin && request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "geoguide-images",
              expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 30, purgeOnQuotaError: true },
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
