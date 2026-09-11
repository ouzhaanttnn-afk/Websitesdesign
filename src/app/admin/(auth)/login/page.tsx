"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { brand } from "@/config/brand";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(params.get("next") || "/admin");
      router.refresh();
      return;
    }

    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    setError(data?.error ?? "Giriş yapılamadı.");
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-alt px-5">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-8 shadow-soft">
        <Image src="/brand/alvera-logo.png" alt={brand.name} width={2603} height={856} className="mx-auto h-9 w-auto" />
        <h1 className="mt-6 text-center font-display text-display-md">Yönetim Paneli</h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="mb-2 block text-body-sm font-medium text-ink-soft">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-border bg-canvas px-4 py-3 text-body-md text-ink outline-none transition-colors duration-300 ease-quiet focus:border-accent-strong"
            />
          </div>

          {error && (
            <p role="alert" className="text-body-sm text-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded bg-ink px-6 py-3 text-body-sm font-medium text-canvas transition-colors duration-300 ease-quiet hover:bg-ink/90 disabled:opacity-60"
          >
            {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
