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
        'textColor': '#1f2937',
        'red':'#f87171',
        'dark-red': '#b91c1c',
      },
      screens: {
        small: { max: '768px'}
      }
    },
    plugins: [],
  }