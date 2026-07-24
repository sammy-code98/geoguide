import { useMutation } from "@tanstack/react-query";
import { estimateCost } from "../api/cost.api";

/** Mutation for requesting a travel cost estimate. */
export function useCostEstimate() {
  return useMutation({ mutationFn: estimateCost });
}
