"use client";

import { useEffect, useMemo, useState } from "react";

import { useHistoryStore } from "@/lib/history-store";

export function useLinkHistory(query: string = "") {
  const links = useHistoryStore((s) => s.links);
  const add = useHistoryStore((s) => s.add);
  const remove = useHistoryStore((s) => s.remove);
  const clear = useHistoryStore((s) => s.clear);

  // Avoid hydration mismatch — Zustand persist hydrates on the client only.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return links;
    return links.filter((l) => {
      const haystack = [
        l.url,
        l.finalUrl,
        l.utms.utm_source,
        l.utms.utm_medium,
        l.utms.utm_campaign,
        l.utms.utm_content,
        l.utms.utm_term,
        l.label,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [links, query]);

  return {
    links: hydrated ? filtered : [],
    total: hydrated ? links.length : 0,
    hydrated,
    add,
    remove,
    clear,
  };
}
