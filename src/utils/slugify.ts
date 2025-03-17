/**
 * Convert a string to a URL-friendly slug
 * Converts to lowercase, removes special characters, and replaces spaces with hyphens
 * 
 * @param str The string to convert to a slug
 * @returns A URL-friendly slug
 */
export default function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
} 