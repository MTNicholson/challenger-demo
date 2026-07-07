export function formatBrandLocation(city?: string | null, address?: string | null) {
  const parts = [city, address]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));

  return parts.join(", ");
}
