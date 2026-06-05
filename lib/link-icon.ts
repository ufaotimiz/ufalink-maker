import type { ComponentType } from "react";
import { Link2, Linkedin, Mail, Phone } from "lucide-react";
import {
  SiApplemusic,
  SiBehance,
  SiCalendly,
  SiDiscord,
  SiDropbox,
  SiFacebook,
  SiGithub,
  SiGooglecalendar,
  SiGoogledocs,
  SiGoogledrive,
  SiGoogleforms,
  SiGooglemaps,
  SiGooglesheets,
  SiInstagram,
  SiLinktree,
  SiMedium,
  SiNotion,
  SiPatreon,
  SiPinterest,
  SiSnapchat,
  SiSoundcloud,
  SiSpotify,
  SiSubstack,
  SiTelegram,
  SiThreads,
  SiTiktok,
  SiTwitch,
  SiVimeo,
  SiWhatsapp,
  SiWordpress,
  SiX,
  SiYoutube,
  SiYoutubemusic,
} from "react-icons/si";

/** Ícone que aceita className — tanto lucide quanto react-icons são compatíveis. */
export type LinkIcon = ComponentType<{ className?: string }>;

/**
 * Detecta o serviço de destino de uma URL e devolve o ícone de marca correspondente.
 * Combina por hostname (e parte do path quando necessário, ex: Google Docs vs Sheets).
 * Cai num ícone genérico de link quando o destino não é reconhecido.
 */
export function getLinkIcon(rawUrl: string): LinkIcon {
  const value = rawUrl.trim();

  if (value.startsWith("mailto:")) return Mail;
  if (value.startsWith("tel:")) return Phone;

  let host = "";
  let path = "";
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    host = url.hostname.replace(/^www\./, "").toLowerCase();
    path = url.pathname.toLowerCase();
  } catch {
    return Link2;
  }

  const is = (...domains: string[]) =>
    domains.some((d) => host === d || host.endsWith(`.${d}`));

  // Google (mesmo host serve vários produtos — desambigua pelo path)
  if (is("drive.google.com")) return SiGoogledrive;
  if (is("docs.google.com")) {
    if (path.startsWith("/spreadsheets")) return SiGooglesheets;
    if (path.startsWith("/forms")) return SiGoogleforms;
    return SiGoogledocs;
  }
  if (is("forms.gle")) return SiGoogleforms;
  if (is("calendar.google.com", "calendar.app.google")) return SiGooglecalendar;
  if (is("maps.google.com", "maps.app.goo.gl", "goo.gl")) return SiGooglemaps;

  if (is("dropbox.com")) return SiDropbox;
  if (is("music.youtube.com")) return SiYoutubemusic;
  if (is("youtube.com", "youtu.be")) return SiYoutube;
  if (is("music.apple.com")) return SiApplemusic;
  if (is("spotify.com", "open.spotify.com")) return SiSpotify;
  if (is("soundcloud.com")) return SiSoundcloud;
  if (is("vimeo.com")) return SiVimeo;

  if (is("wa.me", "whatsapp.com", "api.whatsapp.com", "chat.whatsapp.com"))
    return SiWhatsapp;
  if (is("instagram.com")) return SiInstagram;
  if (is("facebook.com", "fb.com", "fb.me")) return SiFacebook;
  if (is("tiktok.com")) return SiTiktok;
  if (is("linkedin.com", "lnkd.in")) return Linkedin; // Simple Icons removeu o LinkedIn
  if (is("twitter.com", "x.com")) return SiX;
  if (is("t.me", "telegram.me", "telegram.org")) return SiTelegram;
  if (is("snapchat.com")) return SiSnapchat;
  if (is("threads.net")) return SiThreads;
  if (is("pinterest.com", "pin.it")) return SiPinterest;
  if (is("twitch.tv")) return SiTwitch;
  if (is("discord.com", "discord.gg")) return SiDiscord;

  if (is("github.com")) return SiGithub;
  if (is("calendly.com")) return SiCalendly;
  if (is("linktr.ee")) return SiLinktree;
  if (is("notion.so", "notion.site")) return SiNotion;
  if (is("medium.com")) return SiMedium;
  if (is("substack.com")) return SiSubstack;
  if (is("patreon.com")) return SiPatreon;
  if (is("behance.net")) return SiBehance;
  if (is("wordpress.com", "wordpress.org")) return SiWordpress;

  return Link2;
}
