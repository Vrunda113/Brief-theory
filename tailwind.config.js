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
        cream: {
          // A ladder, not one flat colour. With every section on cream, the
          // only thing left to separate them is a tonal step — small enough to
          // read as one family, large enough to see the seam.
          DEFAULT: '#F6EFE8',
          dim: '#EDE4D8',
        },
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
