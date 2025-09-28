/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sand': '#FAF7F2',
        'ink': '#1F2937',
        'teal': {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#0EA5A5',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        'red': '#EF4444',
        'amber': '#F59E0B',
        'light-sand': '#FEFDFB',
      },
    },
  },
  plugins: [],
} 