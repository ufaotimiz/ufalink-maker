// Lista curada de Google Fonts disponíveis no editor de páginas públicas.
// Estes valores são salvos no banco (ClientPage.headingFont / bodyFont)
// e usados tanto pelo seletor quanto pelo loader em /p/[slug].

export type FontCategory = "sans" | "serif" | "display" | "handwriting" | "mono";

export type FontOption = {
  /** chave canônica salva no banco (idêntica ao nome do family no Google Fonts) */
  key: string;
  /** nome exibido na UI */
  label: string;
  category: FontCategory;
  /** valor pronto para usar em CSS `font-family` */
  stack: string;
};

export const FONT_OPTIONS: readonly FontOption[] = [
  // Sans
  { key: "Inter", label: "Inter", category: "sans", stack: "'Inter', system-ui, sans-serif" },
  { key: "Roboto", label: "Roboto", category: "sans", stack: "'Roboto', system-ui, sans-serif" },
  { key: "Open Sans", label: "Open Sans", category: "sans", stack: "'Open Sans', system-ui, sans-serif" },
  { key: "Lato", label: "Lato", category: "sans", stack: "'Lato', system-ui, sans-serif" },
  { key: "Poppins", label: "Poppins", category: "sans", stack: "'Poppins', system-ui, sans-serif" },
  { key: "Montserrat", label: "Montserrat", category: "sans", stack: "'Montserrat', system-ui, sans-serif" },
  { key: "Nunito", label: "Nunito", category: "sans", stack: "'Nunito', system-ui, sans-serif" },
  { key: "Work Sans", label: "Work Sans", category: "sans", stack: "'Work Sans', system-ui, sans-serif" },
  { key: "DM Sans", label: "DM Sans", category: "sans", stack: "'DM Sans', system-ui, sans-serif" },
  { key: "Plus Jakarta Sans", label: "Plus Jakarta Sans", category: "sans", stack: "'Plus Jakarta Sans', system-ui, sans-serif" },
  { key: "Raleway", label: "Raleway", category: "sans", stack: "'Raleway', system-ui, sans-serif" },
  { key: "Quicksand", label: "Quicksand", category: "sans", stack: "'Quicksand', system-ui, sans-serif" },
  { key: "Space Grotesk", label: "Space Grotesk", category: "sans", stack: "'Space Grotesk', system-ui, sans-serif" },

  // Serif
  { key: "Playfair Display", label: "Playfair Display", category: "serif", stack: "'Playfair Display', Georgia, serif" },
  { key: "Merriweather", label: "Merriweather", category: "serif", stack: "'Merriweather', Georgia, serif" },
  { key: "Lora", label: "Lora", category: "serif", stack: "'Lora', Georgia, serif" },
  { key: "Crimson Pro", label: "Crimson Pro", category: "serif", stack: "'Crimson Pro', Georgia, serif" },
  { key: "DM Serif Display", label: "DM Serif Display", category: "serif", stack: "'DM Serif Display', Georgia, serif" },

  // Display
  { key: "Bebas Neue", label: "Bebas Neue", category: "display", stack: "'Bebas Neue', Impact, sans-serif" },
  { key: "Oswald", label: "Oswald", category: "display", stack: "'Oswald', Impact, sans-serif" },

  // Handwriting
  { key: "Caveat", label: "Caveat", category: "handwriting", stack: "'Caveat', cursive" },
  { key: "Dancing Script", label: "Dancing Script", category: "handwriting", stack: "'Dancing Script', cursive" },
  { key: "Pacifico", label: "Pacifico", category: "handwriting", stack: "'Pacifico', cursive" },

  // Mono
  { key: "JetBrains Mono", label: "JetBrains Mono", category: "mono", stack: "'JetBrains Mono', ui-monospace, monospace" },
  { key: "Space Mono", label: "Space Mono", category: "mono", stack: "'Space Mono', ui-monospace, monospace" },
] as const;

export const FONT_KEYS = FONT_OPTIONS.map((f) => f.key) as readonly string[];

export const DEFAULT_HEADING_FONT = "Inter";
export const DEFAULT_BODY_FONT = "Inter";

export function findFont(key: string | null | undefined): FontOption {
  return (
    FONT_OPTIONS.find((f) => f.key === key) ??
    FONT_OPTIONS.find((f) => f.key === DEFAULT_BODY_FONT)!
  );
}

/** Monta a URL do Google Fonts CSS2 carregando o conjunto pedido. */
export function googleFontsHref(keys: string[]): string {
  const unique = Array.from(new Set(keys.filter(Boolean)));
  if (unique.length === 0) return "";
  const families = unique
    .map((k) => `family=${encodeURIComponent(k).replace(/%20/g, "+")}:wght@400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export const FONT_CATEGORY_LABEL: Record<FontCategory, string> = {
  sans: "Sans",
  serif: "Serif",
  display: "Display",
  handwriting: "Manuscrita",
  mono: "Monoespaçada",
};
