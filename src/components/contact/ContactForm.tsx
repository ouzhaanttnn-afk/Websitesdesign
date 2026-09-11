"use client";

import { useState, type FormEvent } from "react";
import { contact } from "@/config/contact";

interface FormState {
  name: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  message?: string;
}

const initialState: FormState = { name: "", phone: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(current: FormState): FormErrors {
    const next: FormErrors = {};
    if (!current.name.trim()) next.name = "Ad soyad gerekli.";
    if (!current.phone.trim()) next.phone = "Telefon numarası gerekli.";
    if (!current.message.trim()) next.message = "Mesajınızı yazmanız gerekli.";
    return next;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const text = `Merhaba, ben ${values.name}.\n\n${values.message}\n\nTelefon: ${values.phone}`;
    const url = `${contact.whatsappHref}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div>
        <label htmlFor="name" className="text-body-sm font-medium text-ink">
          Ad Soyad
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="mt-2 w-full rounded border border-border bg-surface px-4 py-3.5 text-body-md text-ink outline-none transition-colors duration-300 ease-quiet focus:border-accent-strong"
        />
        {errors.name && (
          <p id="name-error" className="mt-2 text-body-sm text-error">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="text-body-sm font-medium text-ink">
          Telefon
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className="mt-2 w-full rounded border border-border bg-surface px-4 py-3.5 text-body-md text-ink outline-none transition-colors duration-300 ease-quiet focus:border-accent-strong"
        />
        {errors.phone && (
          <p id="phone-error" className="mt-2 text-body-sm text-error">
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="text-body-sm font-medium text-ink">
          Mesajınız
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="mt-2 w-full rounded border border-border bg-surface px-4 py-3.5 text-body-md text-ink outline-none transition-colors duration-300 ease-quiet focus:border-accent-strong"
        />
        {errors.message && (
          <p id="message-error" className="mt-2 text-body-sm text-error">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 self-start rounded bg-ink px-8 py-4 font-sans text-body-sm font-medium tracking-wide text-canvas transition-colors duration-300 ease-quiet hover:bg-ink/90 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        WhatsApp&apos;tan Gönder
      </button>
      <p className="text-body-sm text-ink-faint">
        Gönder&apos;e bastığınızda mesajınız WhatsApp üzerinden bize iletilmek üzere hazırlanır.
      </p>
    </form>
  );
}
