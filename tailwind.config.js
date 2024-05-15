/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        primary: "#3BBDF8",
        white: "#FFFFFF",
        black: "#000000",
        grayish: "#9FA5B3",
        grayLight: "#9A9FAC",
        bgDark: "#0F172A",
        textWhite: "#E2E8F0",
        textGray: "#949DAB",
      },
    },
  },
  plugins: [],
};
