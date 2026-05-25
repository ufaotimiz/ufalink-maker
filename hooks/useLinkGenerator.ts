"use client";

import { useMemo } from "react";

import { buildUrl, hasAnyUtm, isValidUrl } from "@/lib/url-builder";
import type { LinkFormValues } from "@/types/link";

export function useLinkGenerator(values: LinkFormValues) {
  return useMemo(() => {
    const valid = isValidUrl(values.url);
    const utms = {
      utm_source: values.utm_source,
      utm_medium: values.utm_medium,
      utm_campaign: values.utm_campaign,
      utm_content: values.utm_content,
      utm_term: values.utm_term,
    };
    const finalUrl = valid ? buildUrl(values.url, utms) : "";
    return {
      valid,
      finalUrl,
      hasUtm: hasAnyUtm(utms),
      utms,
    };
  }, [
    values.url,
    values.utm_source,
    values.utm_medium,
    values.utm_campaign,
    values.utm_content,
    values.utm_term,
  ]);
}
