import "server-only";

export type AddressSuggestion = {
  id: string;
  value: string;
  unrestrictedValue: string;
  city: string | null;
  street: string | null;
  house: string | null;
  lat: number | null;
  lng: number | null;
  geoProvider: "dadata";
  geoPlaceId: string | null;
};

type DadataSuggestion = {
  value?: string;
  unrestricted_value?: string;
  data?: {
    fias_id?: string | null;
    kladr_id?: string | null;
    city?: string | null;
    settlement?: string | null;
    street_with_type?: string | null;
    street?: string | null;
    house?: string | null;
    geo_lat?: string | null;
    geo_lon?: string | null;
  };
};

type DadataResponse = {
  suggestions?: DadataSuggestion[];
};

type SuggestAddressOptions = {
  query: string;
  city?: string | null;
  count?: number;
};

const DEFAULT_BASE_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs";
const REQUEST_TIMEOUT_MS = 7000;

export class DadataConfigError extends Error {
  constructor() {
    super("Dadata API token is not configured.");
  }
}

export class DadataRequestError extends Error {
  constructor() {
    super("Dadata address suggest request failed.");
  }
}

export function isDadataConfigured() {
  return Boolean(process.env.DADATA_API_TOKEN?.trim());
}

function parseNumber(value?: string | null) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeSuggestion(suggestion: DadataSuggestion): AddressSuggestion {
  const data = suggestion.data ?? {};
  const value = suggestion.value?.trim() ?? "";
  const unrestrictedValue = suggestion.unrestricted_value?.trim() || value;
  const lat = parseNumber(data.geo_lat);
  const lng = parseNumber(data.geo_lon);
  const geoPlaceId = data.fias_id ?? data.kladr_id ?? null;
  const stableId = geoPlaceId ?? ([lat, lng, unrestrictedValue].filter(Boolean).join(":") || value);

  return {
    id: stableId,
    value,
    unrestrictedValue,
    city: data.city ?? data.settlement ?? null,
    street: data.street_with_type ?? data.street ?? null,
    house: data.house ?? null,
    lat,
    lng,
    geoProvider: "dadata",
    geoPlaceId,
  };
}

export async function suggestAddress({ query, city, count = 8 }: SuggestAddressOptions) {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 3) return [];

  const token = process.env.DADATA_API_TOKEN?.trim();
  if (!token) throw new DadataConfigError();

  const secret = process.env.DADATA_SECRET?.trim();
  const baseUrl = process.env.DADATA_BASE_URL?.trim() || DEFAULT_BASE_URL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  };
  if (secret) headers["X-Secret"] = secret;

  try {
    const response = await fetch(`${baseUrl}/suggest/address`, {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        query: normalizedQuery,
        count: Math.min(Math.max(count, 1), 8),
        locations: city?.trim() ? [{ city: city.trim() }] : undefined,
        from_bound: { value: "city" },
        to_bound: { value: "house" },
      }),
    });

    if (!response.ok) throw new DadataRequestError();

    const data = (await response.json().catch(() => null)) as DadataResponse | null;
    return (data?.suggestions ?? []).map(normalizeSuggestion).filter((item) => item.value);
  } catch (error) {
    if (error instanceof DadataConfigError) throw error;
    throw new DadataRequestError();
  } finally {
    clearTimeout(timeout);
  }
}
