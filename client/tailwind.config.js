/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A1A2E',
          dark: '#0D0D1A',
        },
        accent: {
          DEFAULT: '#E94560',
          hover: '#C73652',
        },
        secondary: {
          DEFAULT: '#16213E',
          light: '#F0F4F8',
        },
        surface: {
          DEFAULT: '#0F3460',
          light: '#FFFFFF',
        },
        gold: '#F5A623',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
