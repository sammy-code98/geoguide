import { useMutation } from "@tanstack/react-query";
import { estimateCost } from "../api/cost.api";

export function useCostEstimate() {
  return useMutation({ mutationFn: estimateCost });
}
