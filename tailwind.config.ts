import type { Config } from 'tailwindcss'
import scrollbar from 'tailwind-scrollbar'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Badge colors using CSS custom properties
        'badge-super-admin': 'hsl(var(--badge-super-admin))',
        'badge-facility-admin': 'hsl(var(--badge-facility-admin))',
        'badge-clinician': 'hsl(var(--badge-clinician))',
        'badge-gender-male': 'hsl(var(--badge-gender-male))',
        'badge-gender-female': 'hsl(var(--badge-gender-female))',
        'badge-gender-other': 'hsl(var(--badge-gender-other))',
        'badge-status-active': 'hsl(var(--badge-status-active))',
        'badge-status-inactive': 'hsl(var(--badge-status-inactive))',
        // Facility level colors
        'badge-facility-level-1': 'hsl(var(--badge-facility-level-1))',
        'badge-facility-level-2': 'hsl(var(--badge-facility-level-2))',
        'badge-facility-level-3': 'hsl(var(--badge-facility-level-3))',
        'badge-facility-level-4': 'hsl(var(--badge-facility-level-4))',
        'badge-facility-level-5': 'hsl(var(--badge-facility-level-5))',
        'badge-facility-level-6': 'hsl(var(--badge-facility-level-6))',
        // Facility performance colors
        'badge-performance-low': 'hsl(var(--badge-performance-low))',
        'badge-performance-medium-low': 'hsl(var(--badge-performance-medium-low))',
        'badge-performance-medium': 'hsl(var(--badge-performance-medium))',
        'badge-performance-medium-high': 'hsl(var(--badge-performance-medium-high))',
        'badge-performance-high': 'hsl(var(--badge-performance-high))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [scrollbar],
}

export default config
