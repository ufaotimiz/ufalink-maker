import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { SavedLink, UtmParams } from "@/types/link";

type AddLinkInput = {
  url: string;
  finalUrl: string;
  utms: UtmParams;
  label?: string;
};

type HistoryState = {
  links: SavedLink[];
  add: (input: AddLinkInput) => SavedLink;
  remove: (id: string) => void;
  clear: () => void;
};

function createId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      links: [],
      add: (input) => {
        const link: SavedLink = {
          id: createId(),
          createdAt: Date.now(),
          ...input,
        };
        set((state) => ({ links: [link, ...state.links] }));
        return link;
      },
      remove: (id) =>
        set((state) => ({ links: state.links.filter((l) => l.id !== id) })),
      clear: () => set({ links: [] }),
    }),
    {
      name: "link-maker:history",
      version: 1,
    },
  ),
);
