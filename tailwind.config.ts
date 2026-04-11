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
        background: "var(--bg-primary)",
        card: "var(--bg-card)",
        "card-hover": "var(--bg-card-hover)",
        "accent-gold": "var(--accent-gold)",
        "accent-gold-light": "var(--accent-gold-light)",
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        border: "var(--border)",
        success: "var(--success)",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        serif: ["var(--font-crimson)"],
      },
    },
  },
  plugins: [],
};
export default config;
