/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#16305C',
          deep: '#0F2F5E',
          mid: '#2E4A75',
        },
        cream: '#F6F0E9',
        slate: {
          brand: '#6C82A2',
          steel: '#A5B8D0',
          pale: '#D8E3F0',
        },
      },
      fontFamily: {
        sans: ['Kanit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
