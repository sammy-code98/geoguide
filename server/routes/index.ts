import { Router } from "express";
import healthRoutes from "./health.routes";
import countriesRoutes from "./countries.routes";

/**
 * Root API router. Feature routers (ai, places, weather, currency) are mounted
 * here as their phases land — the service layer they depend on already exists.
 */
const api = Router();

api.use("/health", healthRoutes);
api.use("/countries", countriesRoutes);

export default api;
