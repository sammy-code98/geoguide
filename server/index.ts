import { createApp } from "./app";
import { env, integrations } from "./config/env";

const app = createApp();

const server = app.listen(env.port, () => {
  const configured = Object.entries(integrations)
    .filter(([, ready]) => ready)
    .map(([name]) => name)
    .join(", ");
  console.log(`[server] GeoGuide API listening on http://localhost:${env.port}`);
  console.log(`[server] Integrations ready: ${configured || "none"}`);
});

// Graceful shutdown.
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    console.log(`\n[server] ${signal} received, shutting down.`);
    server.close(() => process.exit(0));
  });
}
