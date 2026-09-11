import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminPassword, getSessionSecret } from "@/domains/admin/auth";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/domains/admin/session";

// Basit, tek-instance bellek içi deneme sınırlama — V0.1 için yeterli;
// dağıtık/çoklu instance ortamda gerçek bir rate-limit servisi gerekir.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Çok fazla deneme yapıldı. Birkaç dakika sonra tekrar deneyin." }, { status: 429 });
  }

  const secret = getSessionSecret();
  if (!secret) {
    return NextResponse.json({ error: "Sunucu yapılandırması eksik (ADMIN_SESSION_SECRET)." }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  if (!body?.password || !verifyAdminPassword(body.password)) {
    return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
  }

  const token = await createSessionToken(secret);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
