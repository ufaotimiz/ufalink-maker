import type { ComponentType } from "react";
import { Globe, Link2, Linkedin, Mail, Phone } from "lucide-react";
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

/** Ícone que aceita className — lucide e react-icons são ambos compatíveis. */
export type LinkIcon = ComponentType<{ className?: string }>;

export type IconEntry = { key: string; label: string; Icon: LinkIcon };

/**
 * Fonte única de ícones do projeto. As chaves são slugs minúsculos (Simple Icons),
 * usadas tanto pela detecção automática (`getLinkIconKey`) quanto pelo seletor manual.
 * LinkedIn usa o ícone do lucide porque o Simple Icons removeu a marca.
 */
export const ICON_REGISTRY: IconEntry[] = [
  // Google
  { key: "googledrive", label: "Google Drive", Icon: SiGoogledrive },
  { key: "googledocs", label: "Google Docs", Icon: SiGoogledocs },
  { key: "googlesheets", label: "Google Sheets", Icon: SiGooglesheets },
  { key: "googleforms", label: "Google Forms", Icon: SiGoogleforms },
  { key: "googlecalendar", label: "Google Agenda", Icon: SiGooglecalendar },
  { key: "googlemaps", label: "Google Maps", Icon: SiGooglemaps },
  // Armazenamento / mídia
  { key: "dropbox", label: "Dropbox", Icon: SiDropbox },
  { key: "youtube", label: "YouTube", Icon: SiYoutube },
  { key: "youtubemusic", label: "YouTube Music", Icon: SiYoutubemusic },
  { key: "applemusic", label: "Apple Music", Icon: SiApplemusic },
  { key: "spotify", label: "Spotify", Icon: SiSpotify },
  { key: "soundcloud", label: "SoundCloud", Icon: SiSoundcloud },
  { key: "vimeo", label: "Vimeo", Icon: SiVimeo },
  // Redes sociais
  { key: "whatsapp", label: "WhatsApp", Icon: SiWhatsapp },
  { key: "instagram", label: "Instagram", Icon: SiInstagram },
  { key: "facebook", label: "Facebook", Icon: SiFacebook },
  { key: "tiktok", label: "TikTok", Icon: SiTiktok },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "x", label: "X / Twitter", Icon: SiX },
  { key: "telegram", label: "Telegram", Icon: SiTelegram },
  { key: "snapchat", label: "Snapchat", Icon: SiSnapchat },
  { key: "threads", label: "Threads", Icon: SiThreads },
  { key: "pinterest", label: "Pinterest", Icon: SiPinterest },
  { key: "twitch", label: "Twitch", Icon: SiTwitch },
  { key: "discord", label: "Discord", Icon: SiDiscord },
  // Ferramentas / conteúdo
  { key: "github", label: "GitHub", Icon: SiGithub },
  { key: "calendly", label: "Calendly", Icon: SiCalendly },
  { key: "linktree", label: "Linktree", Icon: SiLinktree },
  { key: "notion", label: "Notion", Icon: SiNotion },
  { key: "medium", label: "Medium", Icon: SiMedium },
  { key: "substack", label: "Substack", Icon: SiSubstack },
  { key: "patreon", label: "Patreon", Icon: SiPatreon },
  { key: "behance", label: "Behance", Icon: SiBehance },
  { key: "wordpress", label: "WordPress", Icon: SiWordpress },
  // Genéricos
  { key: "website", label: "Site", Icon: Globe },
  { key: "email", label: "Email", Icon: Mail },
  { key: "phone", label: "Telefone", Icon: Phone },
  { key: "link", label: "Link", Icon: Link2 },
];

const BY_KEY = new Map<string, LinkIcon>(
  ICON_REGISTRY.map((e) => [e.key, e.Icon]),
);

/** Resolve uma chave do registro para o componente de ícone, ou null se desconhecida. */
export function getIconByKey(key: string): LinkIcon | null {
  return BY_KEY.get(key) ?? null;
}
