import { useMutation } from "@tanstack/react-query";
import { getRecommendations } from "../api/recommendations.api";

/** Mutation for generating personalized destination recommendations. */
export function useRecommendations() {
  return useMutation({ mutationFn: getRecommendations });
}
