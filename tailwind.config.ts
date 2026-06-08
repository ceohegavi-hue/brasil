import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-camera)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        border: "oklch(var(--border) / <alpha-value>)",
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        card: "oklch(var(--card) / <alpha-value>)",
        muted: "oklch(var(--muted) / <alpha-value>)",
        "muted-foreground": "oklch(var(--muted-foreground) / <alpha-value>)",
        "brand-blue": "oklch(var(--brand-blue) / <alpha-value>)",
        "brand-green": "oklch(var(--brand-green) / <alpha-value>)",
        "brand-yellow": "oklch(var(--brand-yellow) / <alpha-value>)",
      },
    },
  },
  plugins: [],
}

export default config
