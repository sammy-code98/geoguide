import { Router } from "express";
import healthRoutes from "./health.routes";
import countriesRoutes from "./countries.routes";
import aiRoutes from "./ai.routes";
import placesRoutes from "./places.routes";
import travelCostRoutes from "./travelCost.routes";
import weatherRoutes from "./weather.routes";
import exchangeRoutes from "./exchange.routes";
import { aiRateLimiter } from "../middleware/rateLimit";

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
