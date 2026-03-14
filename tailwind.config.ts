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
        background: "var(--bg)",
        surface: "var(--surface)",
        border: "var(--border)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
      },
      borderRadius: {
        lg: "14px",
        md: "10px",
        sm: "8px"
      },
      boxShadow: {
        subtle: "0 14px 45px rgba(0,0,0,0.35)"
      },
      transitionTimingFunction: {
        subtle: "cubic-bezier(0.16, 1, 0.3, 1)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;

