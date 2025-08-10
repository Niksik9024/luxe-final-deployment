
import type {Config} from 'tailwindcss';

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
      },
      screens: {
        xs: "475px",
        "2xl": "1400px",
      },
    },
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Playfair Display', 'serif'],
      },
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
        // Luxury color additions
        luxury: {
          gold: "hsl(var(--luxury-gold))",
          dark: "hsl(var(--luxury-dark))",
          accent: "hsl(var(--luxury-accent))",
          border: "hsl(var(--luxury-border))",
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
        "luxury-fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "luxury-slide-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "luxury-shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "luxury-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.4)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "luxury-fade-in": "luxury-fade-in 0.8s ease-out",
        "luxury-slide-up": "luxury-slide-up 0.6s ease-out",
        "luxury-shimmer": "luxury-shimmer 2s infinite",
        "luxury-glow": "luxury-glow 2s infinite",
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #d4af37 0%, #ffd700 100%)',
        'luxury-dark-gradient': 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
      },
      boxShadow: {
        'luxury': '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(212, 175, 55, 0.1)',
        'luxury-hover': '0 30px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(212, 175, 55, 0.2)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
