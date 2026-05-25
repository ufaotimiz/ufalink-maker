// Slugs reservados (rotas existentes ou prováveis no futuro)
export const RESERVED_SLUGS = new Set([
  "api",
  "dashboard",
  "p",
  "utm-builder",
  "admin",
  "login",
  "logout",
  "signin",
  "signout",
  "settings",
  "account",
  "billing",
  "help",
  "about",
  "terms",
  "privacy",
  "new",
  "edit",
  "create",
  "delete",
  "_next",
  "static",
  "favicon",
]);

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

export function isValidSlug(slug: string): boolean {
  if (!slug) return false;
  if (slug.length < 2 || slug.length > 50) return false;
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(slug)) return false;
  if (isReservedSlug(slug)) return false;
  return true;
}
