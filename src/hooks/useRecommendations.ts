import { useMutation } from "@tanstack/react-query";
import { getRecommendations } from "../api/recommendations.api";

export function useRecommendations() {
  return useMutation({ mutationFn: getRecommendations });
}
