import { Router } from "express";
import healthRoutes from "./health.routes.js";
import countriesRoutes from "./countries.routes.js";
import aiRoutes from "./ai.routes.js";
import placesRoutes from "./places.routes.js";
import travelCostRoutes from "./travelCost.routes.js";
import weatherRoutes from "./weather.routes.js";
import exchangeRoutes from "./exchange.routes.js";
import { aiRateLimiter } from "../middleware/rateLimit.js";

/**
 * Root API router. Feature routers (places, weather, currency) are mounted here
 * as their phases land — the service layer they depend on already exists.
 */
const api = Router();

api.use("/health", healthRoutes);
api.use("/countries", countriesRoutes);
api.use("/ai", aiRateLimiter, aiRoutes);
api.use("/places", placesRoutes);
api.use("/travel-cost", aiRateLimiter, travelCostRoutes);
api.use("/weather", weatherRoutes);
api.use("/exchange", exchangeRoutes);

export default api;
