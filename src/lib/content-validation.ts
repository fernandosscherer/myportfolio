const RESERVED_PAGE_SLUGS = new Set([
  "admin",
  "projects",
  "experience",
  "skills",
  "resume",
  "about",
  "contact",
  "robots.txt",
  "sitemap.xml",
  "favicon.ico",
]);

export function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCustomPageSlugError(
  value: string,
  existingRoutes: Iterable<string>,
): string | null {
  const slug = normalizeSlug(value);
  if (!slug) return "Enter a valid page slug.";
  if (RESERVED_PAGE_SLUGS.has(slug)) return `/${slug} is reserved.`;
  if (new Set(existingRoutes).has(`/${slug}`)) return `/${slug} already exists.`;
  return null;
}

export function getSafeExternalUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function isSafeImageSource(value: string | undefined): boolean {
  if (!value) return false;
  return /^\/(?!\/)[^\\]+$/.test(value) ||
    /^data:image\/(?:jpeg|png|webp|gif);base64,/i.test(value) ||
    getSafeExternalUrl(value) !== null;
}
