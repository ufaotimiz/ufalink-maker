"use client";

import Link from "next/link";
import {
  Download,
  Facebook,
  FileText,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Music2,
  Paperclip,
  Twitter,
  Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { findFont, googleFontsHref } from "@/lib/fonts";
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

type BlockType =
  | "HEADING"
  | "PARAGRAPH"
  | "IMAGE"
  | "AUDIO"
  | "VIDEO"
  | "FILE"
  | "DOCUMENT"
  | "EMBED"
  | "DIVIDER";

type SocialLink = { id: string; platform: Social; url: string };
type CustomButton = { id: string; label: string; url: string };
type GalleryImage = { id: string; url: string; caption: string | null };
type Block = {
  id: string;
  type: BlockType;
  text: string | null;
  url: string | null;
  caption: string | null;
};

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
    headingFont: string;
    bodyFont: string;
    socialLinks: SocialLink[];
    buttons: CustomButton[];
    gallery: GalleryImage[];
    blocks: Block[];
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

  const heading = findFont(page.headingFont);
  const body = findFont(page.bodyFont);
  const fontsHref = googleFontsHref([heading.key, body.key]);

  const initials = page.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn("min-h-screen", themeClass)}
      style={{
        ["--brand" as never]: page.themeColor,
        fontFamily: body.stack,
      }}
    >
      {fontsHref ? (
        // eslint-disable-next-line @next/next/no-css-tags
        <link href={fontsHref} rel="stylesheet" />
      ) : null}

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
              style={{ backgroundColor: page.themeColor, fontFamily: heading.stack }}
            >
              {initials}
            </div>
          )}

          <div className="space-y-1.5">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: heading.stack }}
            >
              {page.name}
            </h1>
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
                  fontFamily: heading.stack,
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

        {page.blocks.length > 0 ? (
          <div className="mt-10 space-y-6">
            {page.blocks.map((block) => (
              <BlockView
                key={block.id}
                block={block}
                headingFont={heading.stack}
                themeColor={page.themeColor}
              />
            ))}
          </div>
        ) : null}

        {page.gallery.length > 0 ? (
          <div className="mt-10">
            <h2
              className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
              style={{ fontFamily: heading.stack }}
            >
              Galeria
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {page.gallery.map((img) => (
                <a
                  key={img.id}
                  href={img.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900"
                  aria-label={img.caption ?? "Imagem"}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.caption ?? ""}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {img.caption ? (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {img.caption}
                    </div>
                  ) : null}
                </a>
              ))}
            </div>
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

function BlockView({
  block,
  headingFont,
  themeColor,
}: {
  block: Block;
  headingFont: string;
  themeColor: string;
}) {
  switch (block.type) {
    case "HEADING":
      return (
        <h2
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: headingFont, color: themeColor }}
        >
          {block.text}
        </h2>
      );

    case "PARAGRAPH":
      return (
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {block.text}
        </p>
      );

    case "IMAGE":
      if (!block.url) return null;
      return (
        <figure className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.url}
            alt={block.caption ?? ""}
            loading="lazy"
            className="w-full rounded-lg border border-zinc-200 object-cover dark:border-zinc-800"
          />
          {block.caption ? (
            <figcaption className="text-center text-xs text-zinc-500 dark:text-zinc-400">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );

    case "AUDIO":
      if (!block.url) return null;
      return (
        <div className="space-y-2">
          {block.caption ? (
            <p
              className="text-sm font-medium"
              style={{ fontFamily: headingFont }}
            >
              {block.caption}
            </p>
          ) : null}
          <audio
            controls
            preload="metadata"
            src={block.url}
            className="w-full"
          />
        </div>
      );

    case "VIDEO":
      if (!block.url) return null;
      return (
        <div className="space-y-2">
          {block.caption ? (
            <p
              className="text-sm font-medium"
              style={{ fontFamily: headingFont }}
            >
              {block.caption}
            </p>
          ) : null}
          <video
            controls
            preload="metadata"
            src={block.url}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800"
          />
        </div>
      );

    case "FILE":
      if (!block.url) return null;
      return (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 transition-colors hover:border-current dark:border-zinc-800 dark:bg-zinc-900"
          style={{ color: themeColor }}
        >
          <Paperclip className="h-5 w-5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {block.caption ?? "Baixar arquivo"}
            </p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {block.url}
            </p>
          </div>
          <Download className="h-4 w-4 shrink-0" />
        </a>
      );

    case "DOCUMENT":
      if (!block.url) return null;
      return (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 transition-colors hover:border-current dark:border-zinc-800 dark:bg-zinc-900"
          style={{ color: themeColor }}
        >
          <FileText className="h-5 w-5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {block.caption ?? "Abrir documento"}
            </p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {block.url}
            </p>
          </div>
          <Download className="h-4 w-4 shrink-0" />
        </a>
      );

    case "EMBED":
      if (!block.url) return null;
      return (
        <div className="space-y-2">
          {block.caption ? (
            <p
              className="text-sm font-medium"
              style={{ fontFamily: headingFont }}
            >
              {block.caption}
            </p>
          ) : null}
          <div className="aspect-video w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
            <iframe
              src={block.url}
              title={block.caption ?? "Embed"}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      );

    case "DIVIDER":
      return (
        <hr className="my-2 border-zinc-200 dark:border-zinc-800" />
      );

    default:
      return null;
  }
}
