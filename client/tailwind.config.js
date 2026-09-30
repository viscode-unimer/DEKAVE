/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ========================================================
      // BACKUP PREVIOUS THEME (Crimson / Coral Red Theme):
      // primary:   { DEFAULT: '#1A1A2E', dark: '#0D0D1A' },
      // accent:    { DEFAULT: '#E94560', hover: '#C73652' },
      // secondary: { DEFAULT: '#16213E', light: '#F0F4F8' },
      // surface:   { DEFAULT: '#0F3460', light: '#FFFFFF' },
      // gold:      '#F5A623',
      // ========================================================
      colors: {
        // Dominan Biru Tua (Deep Navy / Royal Midnight 💙)
        primary: {
          DEFAULT: '#0A1329',
          dark: '#050A17',
        },
        // Dominan Biru Muda (Vibrant Sky / Cyan 🩵)
        accent: {
          DEFAULT: '#0284C7',
          hover: '#0369A1',
          light: '#38BDF8',
          dark: '#1D4ED8',
        },
        // Sekunder (Navy Dark & Sky Soft 💙/🩵)
        secondary: {
          DEFAULT: '#111E3D',
          light: '#F0F9FF',
        },
        // Surface Cards & Highlights
        surface: {
          DEFAULT: '#192C56',
          light: '#FFFFFF',
        },
        // Biru Elektrik (Royal Blue 💙)
        royal: '#2563EB',
        // Biru Muda Cerah (Sky Cyan 🩵)
        sky: '#38BDF8',
        gold: '#38BDF8', // Remapped gold to sky blue for unified blue aesthetic
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Syne', 'Plus Jakarta Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'float-reverse': 'float-reverse 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(14px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
