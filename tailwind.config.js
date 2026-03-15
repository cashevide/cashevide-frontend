/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
      },
      colors: {
        /* Backgrounds */
        background: "rgb(var(--color-background) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        input: "rgb(var(--color-input) / <alpha-value>)",

        /* Text */
        heading: "rgb(var(--color-heading) / <alpha-value>)",
        body: "rgb(var(--color-body) / <alpha-value>)",
        btnText: "rgb(var(--color-btn-text) / <alpha-value>)",

        /* Brand / Primary */
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        link: "rgb(var(--color-link) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
