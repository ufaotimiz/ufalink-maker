import { getIconByKey, type LinkIcon } from "@/lib/icons";

export type { LinkIcon };

/**
 * Detecta o serviço de destino de uma URL e devolve a CHAVE de ícone correspondente
 * (do registro em lib/icons.ts). Combina por hostname — e parte do path quando
 * necessário (ex: Google Docs vs Sheets). Cai em "link" quando não reconhece.
 */
export function getLinkIconKey(rawUrl: string): string {
  const value = rawUrl.trim();

  if (value.startsWith("mailto:")) return "email";
  if (value.startsWith("tel:")) return "phone";

  let host = "";
  let path = "";
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    host = url.hostname.replace(/^www\./, "").toLowerCase();
    path = url.pathname.toLowerCase();
  } catch {
    return "link";
  }

  const is = (...domains: string[]) =>
    domains.some((d) => host === d || host.endsWith(`.${d}`));

  // Google (mesmo host serve vários produtos — desambigua pelo path)
  if (is("drive.google.com")) return "googledrive";
  if (is("docs.google.com")) {
    if (path.startsWith("/spreadsheets")) return "googlesheets";
    if (path.startsWith("/forms")) return "googleforms";
    return "googledocs";
  }
  if (is("forms.gle")) return "googleforms";
  if (is("calendar.google.com", "calendar.app.google")) return "googlecalendar";
  if (is("maps.google.com", "maps.app.goo.gl", "goo.gl")) return "googlemaps";

  if (is("dropbox.com")) return "dropbox";
  if (is("music.youtube.com")) return "youtubemusic";
  if (is("youtube.com", "youtu.be")) return "youtube";
  if (is("music.apple.com")) return "applemusic";
  if (is("spotify.com", "open.spotify.com")) return "spotify";
  if (is("soundcloud.com")) return "soundcloud";
  if (is("vimeo.com")) return "vimeo";

  if (is("wa.me", "whatsapp.com", "api.whatsapp.com", "chat.whatsapp.com"))
    return "whatsapp";
  if (is("instagram.com")) return "instagram";
  if (is("facebook.com", "fb.com", "fb.me")) return "facebook";
  if (is("tiktok.com")) return "tiktok";
  if (is("linkedin.com", "lnkd.in")) return "linkedin";
  if (is("twitter.com", "x.com")) return "x";
  if (is("t.me", "telegram.me", "telegram.org")) return "telegram";
  if (is("snapchat.com")) return "snapchat";
  if (is("threads.net")) return "threads";
  if (is("pinterest.com", "pin.it")) return "pinterest";
  if (is("twitch.tv")) return "twitch";
  if (is("discord.com", "discord.gg")) return "discord";

  if (is("github.com")) return "github";
  if (is("calendly.com")) return "calendly";
  if (is("linktr.ee")) return "linktree";
  if (is("notion.so", "notion.site")) return "notion";
  if (is("medium.com")) return "medium";
  if (is("substack.com")) return "substack";
  if (is("patreon.com")) return "patreon";
  if (is("behance.net")) return "behance";
  if (is("wordpress.com", "wordpress.org")) return "wordpress";

  return "link";
}

/** Componente de ícone detectado automaticamente a partir da URL. */
export function getLinkIcon(rawUrl: string): LinkIcon {
  return getIconByKey(getLinkIconKey(rawUrl)) ?? getIconByKey("link")!;
}
