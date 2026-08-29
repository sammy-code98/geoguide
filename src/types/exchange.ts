export interface RatesResponse {
  base: string;
  rates: Record<string, number>;
}

export interface ConversionResult {
  base: string;
  target: string;
  rate: number;
  amount: number;
  result: number;
}
