import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f0ebfe",
          100: "#e0d6fd",
          200: "#c1adfb",
          300: "#a284f9",
          400: "#835bf7",
          500: "#6929f5",
          600: "#5421c4",
          700: "#3f1993",
          800: "#2a1062",
          900: "#150831",
        },
        accent: {
          400: "#f7c05a",
          500: "#f5a623",
          600: "#e09520",
        },
        dark: {
          100: "#2a2a4a",
          200: "#1a1a3a",
          300: "#12122a",
          400: "#0a0a1a",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in":    "fadeIn 0.4s ease-in-out",
        "slide-up":   "slideUp 0.4s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(105,41,245,0.4)" },
          "50%":      { boxShadow: "0 0 25px rgba(105,41,245,0.8)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
