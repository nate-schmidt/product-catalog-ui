import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#6366F1", // indigo-500
          DEFAULT: "#4F46E5", // indigo-600
          dark: "#4338CA", // indigo-700
        },
        secondary: {
          light: "#34D399", // emerald-400
          DEFAULT: "#10B981", // emerald-500
          dark: "#059669", // emerald-600
        },
        accent: {
          light: "#FDBA74", // orange-300
          DEFAULT: "#F97316", // orange-500
          dark: "#C2410C", // orange-700
        },
        base: {
          light: "#FFFFFF",
          DEFAULT: "#F8FAFC", // slate-50
          dark: "#F1F5F9", // slate-100
        },
        dark: {
          light: "#1F2937", // slate-800
          DEFAULT: "#0F172A", // slate-900
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;