/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#042E69',
          deep: '#0E2F5B',
          mid: '#304B6F',
        },
        cream: '#F6EFE8',
        slate: {
          brand: '#6B81A0',
          steel: '#A7B8CE',
          pale: '#DAE6F3',
        },
      },
      fontFamily: {
        sans: ['Kanit', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
