import { z } from "zod";

const utmField = z
  .string()
  .trim()
  .max(120, "Máximo 120 caracteres")
  .optional()
  .or(z.literal(""));

export const linkSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Informe uma URL")
    .url("URL inválida — inclua http:// ou https://"),
  utm_source: utmField,
  utm_medium: utmField,
  utm_campaign: utmField,
  utm_content: utmField,
  utm_term: utmField,
});

export type LinkSchema = z.infer<typeof linkSchema>;
