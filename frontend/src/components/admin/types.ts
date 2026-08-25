export const ADMIN_SECTIONS = [
  'overview',
  'users',
  'products',
  'orders',
] as const;

export type AdminSection = (typeof ADMIN_SECTIONS)[number];

export function isAdminSection(value: string | null): value is AdminSection {
  return ADMIN_SECTIONS.some((section) => section === value);
}
