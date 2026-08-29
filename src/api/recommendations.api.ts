import api from "../utils/axios";
import type { Recommendations, RecommendationsInput } from "../types/recommendations";

/** Get personalized destination recommendations from the backend. */
export const getRecommendations = async (
  input: RecommendationsInput
): Promise<Recommendations> => {
  const { data } = await api.post<Recommendations>("/ai/recommendations", input);
  return data;
};
