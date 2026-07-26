import api from "../utils/axios";
import type { RatesResponse } from "../types/exchange";

/** All conversion rates for a base currency. */
export const getRates = async (base: string): Promise<RatesResponse> => {
  const { data } = await api.get<RatesResponse>("/exchange/rates", {
    params: { base },
  });
  return data;
};
