import { contact } from "@/config/contact";

/**
 * Sabit konumlu WhatsApp hızlı erişim butonu. Marka paletinin dışında,
 * WhatsApp'ın kendi tanınabilir yeşili kullanılır — bu dekoratif değil
 * işlevsel bir yardımcı simge (bkz. design-system/MASTER.md §13.1'deki
 * GemMotif ile aynı mantık: tutarlı, kasıtlı, tek amaçlı).
 */
export function WhatsAppFab() {
  return (
    <a
      href={contact.whatsappHref}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="WhatsApp'tan yazın"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elevated transition-transform duration-300 ease-quiet hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 sm:bottom-6 sm:right-6"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.19 0 4.25.85 5.8 2.4a8.2 8.2 0 0 1 2.42 5.84c0 4.55-3.7 8.25-8.25 8.25h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.27-4.39c.01-4.55 3.71-8.24 8.29-8.24Zm-4.5 4.77c-.15 0-.4.06-.61.3-.21.24-.8.78-.8 1.9s.82 2.2.93 2.36c.11.15 1.6 2.5 3.95 3.4 1.96.75 2.36.6 2.78.56.43-.04 1.38-.56 1.57-1.11.19-.54.19-1 .13-1.1-.06-.09-.21-.15-.43-.26-.23-.11-1.38-.68-1.59-.76-.21-.08-.37-.11-.53.11-.15.23-.6.76-.74.92-.14.15-.27.17-.5.06-.23-.11-.97-.36-1.85-1.14-.68-.61-1.15-1.36-1.28-1.59-.13-.23-.01-.35.1-.47.11-.11.23-.27.35-.41.11-.13.15-.23.23-.38.08-.15.04-.29-.02-.4-.06-.11-.53-1.28-.73-1.75-.19-.46-.39-.4-.53-.41h-.45Z" />
      </svg>
    </a>
  );
}
