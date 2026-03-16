import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "app/**/*.{js,ts,jsx,tsx,mdx}",
    "components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg) / <alpha-value>)",
        "bg-soft": "hsl(var(--bg-soft) / <alpha-value>)",
        text: "hsl(var(--text) / <alpha-value>)",
        "text-secondary": "hsl(var(--text-secondary) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        primary: "hsl(var(--primary) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px"
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.05)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
