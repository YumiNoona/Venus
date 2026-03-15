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
        bg: "var(--bg)",
        "bg-soft": "var(--bg-soft)",
        text: "var(--text)",
        "text-secondary": "var(--text-secondary)",
        border: "var(--border)",
        primary: "var(--primary)",
        accent: "var(--accent)",
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
