/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          light: '#f1f7ed',
          dark: '#243e36',
          accent: '#7ca982',
        },
      },
      fontFamily: {
        serif: ['Garamond', 'Georgia', 'serif'],
      },
      textShadow: {
        'sage': '2px 2px 0px rgba(124, 169, 130, 0.2)',
      },
    },
  },
  plugins: [],
};