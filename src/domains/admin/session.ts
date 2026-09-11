/**
 * İmzalı, HttpOnly çerez tabanlı admin oturumu. Web Crypto API (`crypto.subtle`)
 * kullanılır çünkü hem Node.js hem Edge runtime'da (middleware) çalışır —
 * `node:crypto` yalnızca Node runtime'da çalışırdı.
 *
 * V0.1'de tek bir paylaşımlı mağaza şifresi var (Supabase Auth/çoklu kullanıcı
 * yok — bkz. proje talebi §12, backend yoksa güvenli bir authentication
 * hazırlanması istendi). İleride gerçek kullanıcı hesapları gerekirse bu
 * dosya bir auth sağlayıcısına yönlendirilir, geri kalan kod değişmez.
 */
export const SESSION_COOKIE = "alvera_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 gün

const encoder = new TextEncoder();

function base64url(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  let str = "";
  for (const b of arr) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=");
  const str = atob(padded);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

async function getKey(secret: string) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

export async function createSessionToken(secret: string): Promise<string> {
  const payload = JSON.stringify({ exp: Date.now() + MAX_AGE_SECONDS * 1000 });
  const payloadB64 = base64url(encoder.encode(payload).buffer as ArrayBuffer);
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  return `${payloadB64}.${base64url(signature)}`;
}

export async function verifySessionToken(token: string | undefined | null, secret: string): Promise<boolean> {
  if (!token) return false;
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return false;

  const key = await getKey(secret);
  const expectedSig = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  const expectedB64 = base64url(expectedSig);
  if (expectedB64.length !== sigB64.length) return false;
  // Sabit zamanlı karşılaştırma (aynı uzunlukta olduğu doğrulandıktan sonra).
  let diff = 0;
  for (let i = 0; i < expectedB64.length; i++) diff |= expectedB64.charCodeAt(i) ^ sigB64.charCodeAt(i);
  if (diff !== 0) return false;

  try {
    const payloadJson = new TextDecoder().decode(base64urlToBytes(payloadB64));
    const payload = JSON.parse(payloadJson) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export const SESSION_MAX_AGE_SECONDS = MAX_AGE_SECONDS;
