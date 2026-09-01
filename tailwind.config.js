/** @type {import('tailwindcss').Config} */
const withAlpha = (v) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        white: "#FFFFFF",
        black: "#1C1917", // softened near-black (stone-900) for editorial headings

        // ── Semantic design tokens (CSS vars → theme-aware) ──
        bg: withAlpha("--bg"),
        surface: {
          DEFAULT: withAlpha("--surface"),
          2: withAlpha("--surface-2"),
        },
        border: withAlpha("--border"),
        fg: withAlpha("--fg"),
        muted: withAlpha("--muted"),
        primary: {
          DEFAULT: withAlpha("--primary"),
          foreground: withAlpha("--primary-foreground"),
          hover: withAlpha("--primary-hover"),
        },
        danger: withAlpha("--danger"),
        success: withAlpha("--success"),
        warning: withAlpha("--warning"),
        ring: withAlpha("--ring"),

        // ── Legacy names (mapped to new palette so existing classes hold) ──
        secondary: withAlpha("--danger"), // was decorative red-orange → now error-only
        grayish: "#A8A29E", // stone-400
        grayLight: "#A8A29E",
        bgDark: "#1C1917", // stone-900 surface
        textWhite: "#F5F5F4", // stone-100
        textGray: "#78716C", // stone-500
      },
      fontFamily: {
        sans: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"],
        serif: ['"Fraunces Variable"', "Georgia", "Cambria", "serif"],
      },
      borderRadius: {
        none: "0",
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
        xl: "14px",
        "2xl": "16px",
        "3xl": "18px",
        full: "9999px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        sm: "0 1px 3px 0 rgb(0 0 0 / 0.06)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.06)",
        md: "0 2px 8px -2px rgb(0 0 0 / 0.08)",
        lg: "0 6px 20px -6px rgb(0 0 0 / 0.08)",
        xl: "0 10px 30px -10px rgb(0 0 0 / 0.10)",
        card: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        none: "none",
      },
    },
  },
  plugins: [],
};
