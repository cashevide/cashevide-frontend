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
        /* 1. Base Colors */
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",

        /* 2. Surfaces */
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        popover: {
          DEFAULT: "var(--color-popover)",
          foreground: "var(--color-popover-foreground)",
        },

        /* 3. Brand / Action Colors */
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        brand: {
          DEFAULT: "var(--color-brand)",
          foreground: "var(--color-brand-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },

        /* 4. Semantic / Feedback */
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-destructive-foreground)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          foreground: "var(--color-success-foreground)",
        },

        /* 5. Muted */
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },

        /* 6. UI Elements */
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
      },
    },
  },
  plugins: [],
};
