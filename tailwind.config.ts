import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FBF6EC",
          50: "#FFFDFA",
          100: "#FBF6EC",
          200: "#F5EBD6",
        },
        beige: {
          DEFAULT: "#EFE4CD",
          light: "#F6EEDD",
          dark: "#E2D2AC",
        },
        maroon: {
          DEFAULT: "#6B1220",
          50: "#FBEAEA",
          100: "#F0C9CD",
          400: "#8C1D2B",
          500: "#6B1220",
          600: "#5A0F1A",
          700: "#450B14",
          800: "#33080F",
          900: "#22050A",
        },
        saffron: {
          DEFAULT: "#D89A2B",
          50: "#FCF3E1",
          100: "#F6E1B4",
          400: "#E0AA3E",
          500: "#D89A2B",
          600: "#B87E1C",
          700: "#93641A",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#E4C874",
          dark: "#9C7C1D",
        },
        charcoal: {
          DEFAULT: "#2A2320",
          light: "#4A3F3A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "diya-pattern":
          "radial-gradient(circle at 1px 1px, rgba(107,18,32,0.08) 1px, transparent 0)",
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(42, 35, 32, 0.12)",
        "card-hover": "0 12px 32px -8px rgba(107, 18, 32, 0.22)",
        gold: "0 4px 20px -4px rgba(201, 162, 39, 0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      animation: {
        "spin-slow": "spin 14s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
