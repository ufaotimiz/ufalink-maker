import {
  Facebook,
  Instagram,
  Linkedin,
  Music2,
  Twitter,
  Youtube,
} from "lucide-react";

import type { SocialPreset } from "@/types/link";

export const SOCIAL_PRESETS: SocialPreset[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    source: "instagram",
    mediums: ["bio", "stories", "feed", "reels", "dm"],
    color: "text-pink-500",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    source: "facebook",
    mediums: ["post", "stories", "ads", "groups", "messenger"],
    color: "text-blue-600",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music2,
    source: "tiktok",
    mediums: ["bio", "video", "live", "ads"],
    color: "text-foreground",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    source: "linkedin",
    mediums: ["post", "article", "ads", "dm", "company"],
    color: "text-sky-700",
  },
  {
    id: "twitter",
    name: "X / Twitter",
    icon: Twitter,
    source: "twitter",
    mediums: ["tweet", "bio", "dm", "ads"],
    color: "text-foreground",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    source: "youtube",
    mediums: ["description", "comment", "community", "shorts", "ads"],
    color: "text-red-600",
  },
];

export function findPresetBySource(source?: string): SocialPreset | undefined {
  if (!source) return undefined;
  return SOCIAL_PRESETS.find((p) => p.source === source.toLowerCase().trim());
}
