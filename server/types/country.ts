/**
 * Normalized, frontend-safe country contract. The backend maps whatever the
 * upstream data source returns into this stable shape, so the frontend never
 * depends on a third-party response format (currently countries.dev).
 */
export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface Country {
  name: string;
  nativeName: string | null;
  cca2: string;
  cca3: string;
  capital: string | null;
  region: string;
  subregion: string | null;
  population: number;
  area: number | null;
  populationDensity: number | null;
  independent: boolean | null;
  flagPng: string;
  flagSvg: string | null;
  flagEmoji: string | null;
  languages: string[];
  currencies: Currency[];
  timezones: string[];
  callingCodes: string[];
  topLevelDomains: string[];
  altSpellings: string[];
  latlng: [number, number] | null;
  borders: string[];
}
