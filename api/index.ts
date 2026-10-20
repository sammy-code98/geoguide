import { createApp } from "../server/app.js";

/**
 * Vercel serverless entry. Every `/api/*` request is rewritten here (see
 * vercel.json) with its original URL intact, so the Express app routes it
 * exactly as it does locally. `server/index.ts` remains the local dev entry.
 */
export default createApp();
