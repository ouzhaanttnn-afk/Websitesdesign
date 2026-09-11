import type { Config } from "tailwindcss";

// Tailwind's runtime accepts a function returning a color string for
// alpha-aware colors, but the published types only allow `string`. Cast the
// function through `unknown` so TS accepts it while the JIT engine still
// calls it as intended.
const withAlpha = (variable: string) =>
  (({ opacityValue }: { opacityValue?: string }) =>
    opacityValue
      ? `rgb(var(${variable}) / ${opacityValue})`
      : `rgb(var(${variable}))`) as unknown as string;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: withAlpha("--color-ink"),
        "ink-soft": withAlpha("--color-ink-soft"),
        "ink-faint": withAlpha("--color-ink-faint"),
        canvas: withAlpha("--color-canvas"),
        surface: withAlpha("--color-surface"),
        "surface-alt": withAlpha("--color-surface-alt"),
        border: withAlpha("--color-border"),
        accent: withAlpha("--color-accent"),
        "accent-strong": withAlpha("--color-accent-strong"),
        error: withAlpha("--color-error"),
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["clamp(2.75rem, 2rem + 3.2vw, 4.5rem)", { lineHeight: "1.04", letterSpacing: "-0.01em" }],
        "display-xl": ["clamp(2.25rem, 1.8rem + 2vw, 3.25rem)", { lineHeight: "1.08", letterSpacing: "-0.01em" }],
        "display-lg": ["clamp(1.875rem, 1.6rem + 1.2vw, 2.5rem)", { lineHeight: "1.14" }],
        "display-md": ["clamp(1.5rem, 1.35rem + 0.6vw, 1.875rem)", { lineHeight: "1.2" }],
        "body-lg": ["1.125rem", { lineHeight: "1.65" }],
        "body-md": ["1rem", { lineHeight: "1.65" }],
        "body-sm": ["0.9375rem", { lineHeight: "1.55" }],
        eyebrow: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.14em" }],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "10px",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(26 23 20 / 0.04), 0 12px 32px -12px rgb(26 23 20 / 0.14)",
        elevated: "0 2px 4px rgb(26 23 20 / 0.05), 0 24px 48px -16px rgb(26 23 20 / 0.18)",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      maxWidth: {
        content: "1280px",
        prose: "68ch",
      },
      transitionTimingFunction: {
        quiet: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      screens: {
        "3xl": "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
