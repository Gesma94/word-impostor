/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
      colors: {
        'inputBg': '#ffffff',
        'disabledInputBg': '#cfcbcb',
        'transparent': 'transparent',
        'white': '#f3f4f6',
        'inputBorder': '#37415133',
        'color': '#374151',
        'red':'#f87171',
        'error': '#b91c1c',
        'black': '#1f2937',
        'dark-red': '#b91c1c',
        'blue': '#2563eb',
        'overlay': "#000000AA"
      },
      screens: {
        small: { max: '768px'}
      }
    },
    plugins: [],
  }