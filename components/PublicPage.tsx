"use client";

import Link from "next/link";
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Music2,
  Twitter,
  Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Social =
  | "INSTAGRAM"
  | "FACEBOOK"
  | "TIKTOK"
  | "X"
  | "YOUTUBE"
  | "LINKEDIN"
  | "WHATSAPP"
  | "WEBSITE"
  | "EMAIL";

type ThemeMode = "LIGHT" | "DARK" | "AUTO";

type SocialLink = { id: string; platform: Social; url: string };
type CustomButton = { id: string; label: string; url: string };

const SOCIAL_ICON: Record<Social, LucideIcon> = {
  INSTAGRAM: Instagram,
  FACEBOOK: Facebook,
  TIKTOK: Music2,
  X: Twitter,
  YOUTUBE: Youtube,
  LINKEDIN: Linkedin,
  WHATSAPP: MessageCircle,
  WEBSITE: Globe,
  EMAIL: Mail,
};

const SOCIAL_LABEL: Record<Social, string> = {
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  TIKTOK: "TikTok",
  X: "X",
  YOUTUBE: "YouTube",
  LINKEDIN: "LinkedIn",
  WHATSAPP: "WhatsApp",
  WEBSITE: "Site",
  EMAIL: "Email",
};

type Props = {
  page: {
    name: string;
    bio: string | null;
    avatarUrl: string | null;
    coverUrl: string | null;
    themeColor: string;
    themeMode: ThemeMode;
    socialLinks: SocialLink[];
    buttons: CustomButton[];
  };
};

export function PublicPage({ page }: Props) {
  const isDark = page.themeMode === "DARK";
  const auto = page.themeMode === "AUTO";

  const themeClass = isDark
    ? "dark bg-zinc-950 text-zinc-50"
    : auto
      ? "bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50"
      : "bg-white text-zinc-900";

  const initials = page.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn("min-h-screen", themeClass)}
      style={{ ["--brand" as never]: page.themeColor }}
    >
      {page.coverUrl ? (
        <div
          className="relative h-44 w-full bg-cover bg-center sm:h-60"
          style={{ backgroundImage: `url(${page.coverUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
        </div>
      ) : (
        <div
          className="h-32 w-full sm:h-40"
          style={{
            background: `linear-gradient(135deg, ${page.themeColor}, ${page.themeColor}80)`,
          }}
        />
      )}

      <div className="mx-auto -mt-14 max-w-md px-4 pb-12">
        <div className="flex flex-col items-center gap-4 text-center">
          {page.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={page.avatarUrl}
              alt={page.name}
              className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg dark:border-zinc-900"
            />
          ) : (
            <div
              className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white text-3xl font-bold text-white shadow-lg dark:border-zinc-900"
              style={{ backgroundColor: page.themeColor }}
            >
              {initials}
            </div>
          )}

          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight">{page.name}</h1>
            {page.bio ? (
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {page.bio}
              </p>
            ) : null}
          </div>

          {page.socialLinks.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {page.socialLinks.map((social) => {
                const Icon = SOCIAL_ICON[social.platform];
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LABEL[social.platform]}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition-all hover:scale-110 hover:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                    style={{
                      ["--tw-hover-bg" as never]: page.themeColor,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        page.themeColor;
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        page.themeColor;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "";
                      (e.currentTarget as HTMLElement).style.color = "";
                      (e.currentTarget as HTMLElement).style.borderColor = "";
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>

        {page.buttons.length > 0 ? (
          <div className="mt-8 space-y-3">
            {page.buttons.map((btn) => (
              <a
                key={btn.id}
                href={btn.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center justify-center rounded-xl border-2 px-4 text-center text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-md"
                style={{
                  borderColor: page.themeColor,
                  color: page.themeColor,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    page.themeColor;
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "";
                  (e.currentTarget as HTMLElement).style.color =
                    page.themeColor;
                }}
              >
                {btn.label}
              </a>
            ))}
          </div>
        ) : null}

        <footer className="mt-16 text-center">
          <Link
            href="/"
            className="text-xs text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Feito com Link Maker
          </Link>
        </footer>
      </div>
    </div>
  );
}
