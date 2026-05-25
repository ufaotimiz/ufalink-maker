import type { UtmParams } from "@/types/link";

const UTM_KEYS: (keyof UtmParams)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

export function isValidUrl(value: string): boolean {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function buildUrl(baseUrl: string, utms: UtmParams): string {
  if (!isValidUrl(baseUrl)) return baseUrl;

  const url = new URL(baseUrl);

  for (const key of UTM_KEYS) {
    const value = utms[key]?.trim();
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  }

  return url.toString();
}

export function hasAnyUtm(utms: UtmParams): boolean {
  return UTM_KEYS.some((key) => Boolean(utms[key]?.trim()));
}
