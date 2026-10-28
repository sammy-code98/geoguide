import { useQuery } from "@tanstack/react-query";
import { getCountryInsights } from "../api/ai.api";
import { QueryKey } from "../utils/queryKeys";


export function useCountryInsights(code: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: [QueryKey.countryInsights, code],
    queryFn: () => getCountryInsights(code as string),
    enabled: enabled && Boolean(code),
    staleTime: 1000 * 60 * 60, // 1 hour — results are cached server-side too
    retry: 1,
  });
}
