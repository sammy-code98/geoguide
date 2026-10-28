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
        black: "#1C1917",

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
        accent: {
          DEFAULT: withAlpha("--accent"),
          foreground: withAlpha("--accent-foreground"),
        },
        sea: { DEFAULT: withAlpha("--sea"), soft: withAlpha("--sea-soft") },
        sand: { DEFAULT: withAlpha("--sand"), soft: withAlpha("--sand-soft") },
        terracotta: {
          DEFAULT: withAlpha("--terracotta"),
          soft: withAlpha("--terracotta-soft"),
        },
        olive: {
          DEFAULT: withAlpha("--olive"),
          soft: withAlpha("--olive-soft"),
        },
        sun: withAlpha("--sun"),
        danger: withAlpha("--danger"),
        success: withAlpha("--success"),
        warning: withAlpha("--warning"),
        ring: withAlpha("--ring"),

        secondary: withAlpha("--danger"),
        grayish: "#A8A29E",
        grayLight: "#A8A29E",
        bgDark: "#1C1917",
        textWhite: "#F5F5F4",
        textGray: "#78716C",
      },
      fontFamily: {
        sans: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"],
        serif: ['"Fraunces Variable"', "Georgia", "Cambria", "serif"],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "typing-dot": {
          "0%, 100%": { opacity: "0.35", transform: "translateY(0)" },
          "50%": { opacity: "1", transform: "translateY(-3px)" },
        },
        "float-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "note-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "typing-dot": "typing-dot 1.2s ease-in-out infinite",
        "float-soft": "float-soft 3s ease-in-out infinite",
        "fade-in": "fade-in 0.2s ease-out both",
        "note-in": "note-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
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
