type Tone = "default" | "inverted";

/**
 * `default` = ivory/canvas zemin üzerinde (accent-strong, WCAG AA geçer).
 * `inverted` = koyu (`ink`) veya görsel zemin üzerinde (accent, WCAG AA geçer).
 * Renk her zaman tone üzerinden seçilir; çağıran taraf className ile rengi
 * ezmeye çalışmamalıdır (bkz. Button bileşenindeki aynı disiplin).
 */
const toneClass: Record<Tone, string> = {
  default: "text-accent-strong",
  inverted: "text-accent",
};

export function Eyebrow({
  children,
  tone = "default",
  className = "",
}: {
  children: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <p
      className={`font-sans text-eyebrow font-medium uppercase tracking-widest mb-4 ${toneClass[tone]} ${className}`.trim()}
    >
      {children}
    </p>
  );
}
