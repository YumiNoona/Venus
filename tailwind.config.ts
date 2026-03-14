import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0B0C",
        card: "#111214",
        border: "#1E1E22",
        accent: "#C9A46C",
        "accent-soft": "#C9A46C1A"
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

