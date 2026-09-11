import { timingSafeEqual } from "node:crypto";

/** Yalnızca Node runtime'da (login API route) kullanılır — node:crypto gerektirir. */
export function verifyAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function getSessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET ?? null;
}
