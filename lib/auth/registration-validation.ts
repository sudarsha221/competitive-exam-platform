export function normalizeRegistrationPhone(value: string): string | null {
  const compact = value.trim().replace(/[\s()-]/g, "");

  if (/^\+[1-9]\d{7,14}$/.test(compact)) return compact;
  if (/^\d{10}$/.test(compact)) return `+91${compact}`;

  return null;
}
