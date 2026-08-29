import { useQuery } from "@tanstack/react-query";
import { getRates } from "../api/exchange.api";
import { QueryKey } from "../utils/queryKeys";

/** Fetches conversion rates for a base currency (cached; changes slowly). */
export function useExchangeRates(base: string) {
  return useQuery({
    queryKey: [QueryKey.exchangeRates, base],
    queryFn: () => getRates(base),
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });
}
