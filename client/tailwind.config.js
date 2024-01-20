/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
      colors: {
        'transparent': 'transparent',
        'white': '#e2e8f0',
        'color': '#374151',
        'red':'#f87171',
        'dark-red': '#b91c1c',
        'blue': '#2563eb'
      },
      screens: {
        small: { max: '768px'}
      }
    },
    plugins: [],
  }