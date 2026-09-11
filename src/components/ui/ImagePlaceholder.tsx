/**
 * Gerçek fotoğraf/görsel gelene kadar kullanılan geçici görsel alanı.
 * Bilinçli olarak nötr tutulur: altın gradient, parlak efekt veya stok
 * "mücevher" ikonu yığını kullanılmaz (bkz. design-system/MASTER.md §13).
 *
 * Gerçek görsel eklenirken bu bileşenin yerine `next/image` ile aynı
 * `alt` metni kullanılmalıdır — bkz. ASSET_CHECKLIST.md.
 */
export function ImagePlaceholder({
  label,
  aspect = "aspect-[4/5]",
  className = "",
}: {
  label: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative flex w-full items-end overflow-hidden border border-border bg-surface-alt ${aspect} ${className}`.trim()}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-ink-faint/60"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M14 18 L24 6 L34 18 L24 42 Z" />
        <path d="M14 18 L34 18" />
        <path d="M19 18 L24 6 L29 18" />
        <path d="M14 18 L24 42 M34 18 L24 42" />
      </svg>
      <span className="relative w-full bg-surface/70 px-4 py-2 text-body-sm text-ink-faint">
        {label}
      </span>
    </div>
  );
}
