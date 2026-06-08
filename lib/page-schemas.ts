import { z } from "zod";

import { FONT_KEYS } from "@/lib/fonts";
import { isValidSlug } from "@/lib/slug";

const slugSchema = z
  .string()
  .trim()
  .min(2, "Mínimo 2 caracteres")
  .max(50, "Máximo 50 caracteres")
  .refine(isValidSlug, "Slug inválido (use a-z, 0-9, hífen) ou reservado");

const urlSchema = z
  .string()
  .trim()
  .url("URL inválida — inclua https://")
  .max(500);

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .url("URL inválida")
  .optional()
  .or(z.literal(""));

export const createPageSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100),
  slug: slugSchema,
});

export const SOCIAL_PLATFORMS = [
  "INSTAGRAM",
  "FACEBOOK",
  "TIKTOK",
  "X",
  "YOUTUBE",
  "LINKEDIN",
  "WHATSAPP",
  "WEBSITE",
  "EMAIL",
] as const;

export const THEME_MODES = ["LIGHT", "DARK", "AUTO"] as const;

const fontKeySchema = z
  .string()
  .trim()
  .refine((v) => (FONT_KEYS as readonly string[]).includes(v), "Fonte inválida");

export const updatePageSchema = z.object({
  name: z.string().trim().min(1).max(100),
  bio: z.string().trim().max(280).optional().or(z.literal("")),
  avatarUrl: optionalUrl,
  coverUrl: optionalUrl,
  themeColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use formato #RRGGBB"),
  bgColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use formato #RRGGBB")
    .optional()
    .or(z.literal("")),
  themeMode: z.enum(THEME_MODES),
});

export const updateFontsSchema = z.object({
  headingFont: fontKeySchema,
  bodyFont: fontKeySchema,
});

export const BLOCK_TYPES = [
  "HEADING",
  "PARAGRAPH",
  "IMAGE",
  "AUDIO",
  "VIDEO",
  "FILE",
  "DOCUMENT",
  "EMBED",
  "DIVIDER",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export const BLOCK_SIZES = ["SMALL", "MEDIUM", "LARGE", "FULL"] as const;
export type BlockSize = (typeof BLOCK_SIZES)[number];

// Cada tipo tem campos diferentes. Validamos no server pela combinação.
export const blockInputSchema = z
  .object({
    type: z.enum(BLOCK_TYPES),
    size: z.enum(BLOCK_SIZES).optional(),
    text: z.string().trim().max(2000).optional().or(z.literal("")),
    url: z.string().trim().max(1000).optional().or(z.literal("")),
    caption: z.string().trim().max(280).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const needsText: BlockType[] = ["HEADING", "PARAGRAPH"];
    const needsUrl: BlockType[] = [
      "IMAGE",
      "AUDIO",
      "VIDEO",
      "FILE",
      "DOCUMENT",
      "EMBED",
    ];
    if (needsText.includes(data.type) && !data.text) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["text"],
        message: "Texto obrigatório",
      });
    }
    if (needsUrl.includes(data.type) && data.url) {
      const parsed = z.string().url().safeParse(data.url);
      if (!parsed.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["url"],
          message: "URL inválida — inclua https://",
        });
      }
    }
  });

export const socialLinkSchema = z.object({
  platform: z.enum(SOCIAL_PLATFORMS),
  url: urlSchema,
});

export const customButtonSchema = z.object({
  label: z.string().trim().min(1, "Texto obrigatório").max(80),
  url: urlSchema,
});

export const galleryImageSchema = z.object({
  url: urlSchema,
  caption: z.string().trim().max(120).optional().or(z.literal("")),
});

// Override de ícone de um item: null = automático; senão chave do registro ou URL de imagem.
export const iconValueSchema = z.union([z.null(), z.string().trim().max(2000)]);

export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
export type UpdateFontsInput = z.infer<typeof updateFontsSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
export type CustomButtonInput = z.infer<typeof customButtonSchema>;
export type GalleryImageInput = z.infer<typeof galleryImageSchema>;
export type BlockInput = z.infer<typeof blockInputSchema>;
