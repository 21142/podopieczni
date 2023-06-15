// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: ['class'],
  theme: {
    screens: {
      xs: '375px',
      sm: '600px',
      md: '900px',
      lg: '1200px',
      xl: '1536px',
      '2xl': '1800px',
    },
    fontSize: {
      xs: '.75rem',
      sm: '.833rem',
      base: '1rem',
      lg: '1.2rem',
      xl: '1.375rem',
      '2xl': '1.44rem',
      '3xl': '1.728rem',
      '4xl': '2.074rem',
      '5xl': '2.488rem',
      '6xl': '2.986rem',
      '7xl': '3.583rem',
      '8xl': '4.3rem',
      '9xl': '5.16rem',
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1800px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        // sans: '"SF PRO Display","Segoe UI",-apple-system,BlinkMacSystemFont,Roboto,Oxygen,Ubuntu,Cantarel,"Open Sans","Helvetica Neue",sans-serif',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        brand: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        brandAccent: {
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
        neutral: {
          0: '#ffffff',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        primary: {
          50: '#eebdf2',
          100: '#cd6bd6',
          200: '#c505d6',
          300: '#a704b5',
          400: '#9b1ea6',
          600: '#9604a3',
          700: '#7d0388',
          800: '#64026d',
          900: '#520259',
        },
        secondary: {
          50: '#ddf5fc',
          100: '#c0e2ed',
          200: '#a6d4e3',
          300: '#7bc4e3',
          400: '#45b2e1',
        },
        success: {
          50: '#ecfdf5',
          100: '#4ade80',
          200: '#22c55e',
          300: '#16a34a',
          400: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fcd34d',
          200: '#fbbf24',
          300: '#f59e0b',
          400: '#b45309',
        },
        error: {
          50: '#fee2e2',
          100: '#f87171',
          200: '#ef4444',
          300: '#dc2626',
          400: '#b91c1c',
        },
        wave: '#eecbf2',
        selected: '#fadefc',
        clickable: '#ffffff',
        modal: '#f1e1f2',
        tonned: '#f1edfc',
        toned: '#7e10b1',
        dark: '#2b2b2b',
      },
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      maxWidth: {
        '8xl': '96rem',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '4xl': '2rem',
      },
      aspectRatio: {
        '3/1': '1440 / 500',
      },
      keyframes: {
        deviation: {
          '0%': {
            boxShadow: '0 0 0 0 #9b1ea6, 0 0 0 0 #c505d6',
          },
          '8%': {
            boxShadow: '-0.05rem 0 0 0 #9b1ea6, 0.05rem 0 0 0 #c505d6',
          },
          '92%': {
            boxShadow:
              '-0.15rem -0.05rem 0 0 #9b1ea6, 0.15 0.05rem 0 0 #c505d6',
          },
          '100%': {
            boxShadow: '-0.3rem -0.1rem 0 0 #9b1ea6, 0.3rem 0.1rem 0 0 #c505d6',
          },
        },
        blob: {
          '0%': {
            transform: 'scale(1) translate(0px, 0px)',
          },
          '30%': {
            transform: 'scale(0.9) translate(30px, -50px)',
          },
          '70%': {
            transform: 'scale(1.1) translate(-20px, 20px)',
          },
          '100%': {
            transform: 'scale(1) translate(0px, 0px)',
          },
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        spinner:
          '2s linear infinite spin, 1s linear infinite alternate deviation',
        blob: '6s infinite blob',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};
