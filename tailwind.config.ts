import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Specialized Disaster Management & Landslide Risk Tokens
        risk: {
          low: {
            DEFAULT: "hsl(var(--risk-low))",
            foreground: "hsl(var(--risk-low-foreground))",
            muted: "hsl(var(--risk-low-muted))",
            border: "hsl(var(--risk-low-border))",
          },
          moderate: {
            DEFAULT: "hsl(var(--risk-moderate))",
            foreground: "hsl(var(--risk-moderate-foreground))",
            muted: "hsl(var(--risk-moderate-muted))",
            border: "hsl(var(--risk-moderate-border))",
          },
          high: {
            DEFAULT: "hsl(var(--risk-high))",
            foreground: "hsl(var(--risk-high-foreground))",
            muted: "hsl(var(--risk-high-muted))",
            border: "hsl(var(--risk-high-border))",
          },
          critical: {
            DEFAULT: "hsl(var(--risk-critical))",
            foreground: "hsl(var(--risk-critical-foreground))",
            muted: "hsl(var(--risk-critical-muted))",
            border: "hsl(var(--risk-critical-border))",
          },
        },
        gov: {
          navy: "#0a192f",
          blue: "#1e3a8a",
          amber: "#d97706",
          emerald: "#059669",
          slate: "#0f172a",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        pingCritical: {
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulseSlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ping-critical": "pingCritical 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
