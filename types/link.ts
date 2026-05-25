import type { LucideIcon } from "lucide-react";

export type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export type LinkFormValues = {
  url: string;
} & UtmParams;

export type SavedLink = {
  id: string;
  createdAt: number;
  url: string;
  finalUrl: string;
  utms: UtmParams;
  label?: string;
};

export type SocialPreset = {
  id: string;
  name: string;
  icon: LucideIcon;
  source: string;
  mediums: string[];
  color: string;
};
