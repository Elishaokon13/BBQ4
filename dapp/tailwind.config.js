/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        heading: ['Cabinet Grotesk', 'Satoshi', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        background: '#FFFFFF',      // Primary background
        accentPrimary: '#8B5CF6',   // Rich purple
        accentViolet: '#6D28D9',    // Electric violet
        accentLight: '#C4B5FD',     // Soft lavender
        success: '#34D399',         // Mint green
        textPrimary: '#1F2937',     // Deep charcoal
        textSecondary: '#6B7280',   // Medium gray
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        'hero-light': "url('/hero-bg.svg')",
        'hero-dark': "url('/hero-bg.svg')",
      },
      backdropBlur: {
        md: '10px',               // Blur for glassmorphic cards
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)', // Subtle shadow for glass effect
      }
    },
  },
  plugins: [],
} 