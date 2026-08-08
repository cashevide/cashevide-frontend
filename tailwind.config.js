/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    fontSize: {
      xs: ["12px", { lineHeight: "16px" }],
      sm: ["14px", { lineHeight: "20px" }],
      base: ["16px", { lineHeight: "24px" }],
      lg: ["18px", { lineHeight: "26px" }],
      xl: ["20px", { lineHeight: "28px" }],
      "2xl": ["24px", { lineHeight: "32px" }],
      "3xl": ["30px", { lineHeight: "36px" }],
      "4xl": ["36px", { lineHeight: "42px" }],
    },
    extend: {
      fontFamily: {
        sans: ["Geist_400Regular", "sans-serif"],
        medium: ["Geist_500Medium", "sans-serif"],
        semibold: ["Geist_600SemiBold", "sans-serif"],
        bold: ["Geist_700Bold", "sans-serif"],
      },
      colors: {
        /* Base */
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",

        /* Surfaces */
        card: {
          DEFAULT: "rgb(var(--color-card) / <alpha-value>)",
          foreground: "rgb(var(--color-card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--color-popover) / <alpha-value>)",
          foreground: "rgb(var(--color-popover-foreground) / <alpha-value>)",
        },
        overlay: "rgb(var(--color-overlay) / <alpha-value>)",

        /* Brand / Action */
        brand: {
          DEFAULT: "rgb(var(--color-brand) / <alpha-value>)",
          foreground: "rgb(var(--color-brand-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          foreground: "rgb(var(--color-primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
          foreground: "rgb(var(--color-secondary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          foreground: "rgb(var(--color-accent-foreground) / <alpha-value>)",
        },
        link: "rgb(var(--color-link) / <alpha-value>)",

        /* Semantic / Feedback */
        destructive: {
          DEFAULT: "rgb(var(--color-destructive) / <alpha-value>)",
          foreground:
            "rgb(var(--color-destructive-foreground) / <alpha-value>)",
          text: "rgb(var(--color-destructive-text) / <alpha-value>)",
        },
        success: {
          DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
          foreground: "rgb(var(--color-success-foreground) / <alpha-value>)",
          text: "rgb(var(--color-success-text) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--color-warning) / <alpha-value>)",
          foreground: "rgb(var(--color-warning-foreground) / <alpha-value>)",
        },
        info: {
          DEFAULT: "rgb(var(--color-info) / <alpha-value>)",
          foreground: "rgb(var(--color-info-foreground) / <alpha-value>)",
        },

        /* Muted / Disabled */
        muted: {
          DEFAULT: "rgb(var(--color-muted) / <alpha-value>)",
          foreground: "rgb(var(--color-muted-foreground) / <alpha-value>)",
        },
        disabled: {
          DEFAULT: "rgb(var(--color-disabled) / <alpha-value>)",
          foreground: "rgb(var(--color-disabled-foreground) / <alpha-value>)",
        },

        /* UI Elements */
        border: "rgb(var(--color-border) / <alpha-value>)",
        input: "rgb(var(--color-input) / <alpha-value>)",
        ring: "rgb(var(--color-ring) / <alpha-value>)",
      },
      borderRadius: {
        none: "0px",
        sm: "6px",
        DEFAULT: "10px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0px 1px 2px rgba(0, 0, 0, 0.06)",
        DEFAULT: "0px 2px 4px rgba(0, 0, 0, 0.08)",
        md: "0px 4px 8px rgba(0, 0, 0, 0.10)",
        lg: "0px 8px 16px rgba(0, 0, 0, 0.12)",
      },
      maxWidth: {
        narrow: "480px",
        desktop: "1200px",
      },
    },
  },
  plugins: [],
};
