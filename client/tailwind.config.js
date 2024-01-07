/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./src/*.{ts,tsx}", "./src/**/*.{ts,tsx}" ],
  theme: {
    colors: {
      bgDark: '#333333',
      bgLight: '#f5f5f5',
      redLight: '#f39c8e',
      red: '#e74c3c',
      darkDark: '#c0392b',
      textBgLight: '#333333'
    },
    extend: {},
  },
  plugins: [],
}

