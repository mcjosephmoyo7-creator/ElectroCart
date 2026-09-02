import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      colors: {
        // Primary brand blue
        primary: {
          DEFAULT: '#0066CC',
          light: '#1A80E6',
          dark: '#004C99',
          50: '#EBF5FF',
          100: '#D6EAFF',
          200: '#ADD4FF',
          300: '#7FBCFF',
          400: '#4DA0F5',
          500: '#1F85E6',
          600: '#0066CC',
          700: '#004C99',
          800: '#003769',
          900: '#00233F',
        },
        // Accent (monochrome: removed orange, now black)
        accent: {
          DEFAULT: '#111827',
          light: '#374151',
          dark: '#000000',
          50: '#F3F4F6',
          100: '#E5E7EB',
          200: '#D1D5DB',
          400: '#6B7280',
          500: '#111827',
          600: '#000000',
          700: '#000000',
        },
        // Deep navy header/footer
        navy: {
          DEFAULT: '#0A1A2F',
          50: '#16304F',
          100: '#122742',
          200: '#0E1F36',
          300: '#0A1A2F',
          400: '#071524',
          500: '#050F1B',
        },
        // Neutral / text
        body: '#F8FAFC',
        slateText: '#1E293B',
        muted: '#64748B',
        lineBorder: '#E2E8F0',
        success: '#10B981',
        star: '#F59E0B',
      },
      fontFamily: {
        heading: ['var(--font-poppins)', 'Inter', 'Poppins', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        body: ['var(--font-roboto)', 'Roboto', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(2, 25, 47, 0.06), 0 8px 24px rgba(2, 25, 47, 0.06)',
        'card-hover': '0 6px 16px rgba(2, 25, 47, 0.10), 0 14px 40px rgba(2, 25, 47, 0.10)',
        nav: '0 4px 24px rgba(2, 25, 47, 0.08)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'zoom-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'bounce-once': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.4)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(0.92)' },
        },
        'ring': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '15%': { transform: 'rotate(14deg)' },
          '30%': { transform: 'rotate(-12deg)' },
          '45%': { transform: 'rotate(10deg)' },
          '60%': { transform: 'rotate(-8deg)' },
          '75%': { transform: 'rotate(6deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'zoom-in': 'zoom-in 0.25s ease-out',
        'bounce-once': 'bounce-once 0.5s ease-in-out',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'ring': 'ring 0.8s ease-in-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;