import api from "../utils/axios";
import type { CostEstimate, CostEstimateInput } from "../types/cost";

/** Request a travel cost estimate from the backend. */
export const estimateCost = async (input: CostEstimateInput): Promise<CostEstimate> => {
  const { data } = await api.post<CostEstimate>("/travel-cost", input);
  return data;
};
