/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/react-icons/lib/esm/*.{js,jsx,ts,tsx}",
    "node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
<<<<<<< HEAD
        primary: {
          50: '#f7f7f8',
          100: '#eeedf1',
          200: '#d7d7e0',
          300: '#b5b5c4',
          400: '#8c8da4',
          500: '#6e7089',
          600: '#595970',
          700: '#4c4c60',
          800: '#3e3e4e',
          900: '#373743',
          950: '#26252c',
        },
        secondary: {
          50: '#f8f7fb',
          100: '#f2f0f7',
          200: '#e6e4f0',
          300: '#d3cfe3',
          400: '#bbb3d2',
          500: '#a093bf',
          600: '#8c7aad',
          700: '#7c699b',
          800: '#675681',
          900: '#55486a',
          950: '#372e47',
        },
        accent: {
          100: '#FFEBC6',
          200: '#FFD388',
          300: '#FFB13C',
=======
        primary: '#FFDBB5',
        secondary: '#FFFFFF',
        accent: {
          300: '#FFEAC5',
          600: '#6C4E31',
          900: '#603F26',
>>>>>>> c99d5ae7029a5a71888bc8e47bc1f3a4e375216a
        },
        neutral: {
          'white': '#FFFFFF',
          gray: {
            100: '#F4F5F7',
            200: '#E1E4E8',
            300: '#CFD4DD',
            400: '#9DA4B4',
            500: '#6B7280',
          }
        },
        status: {
          'success': '#00B012',
          'error': '#CD3535',
          'warning': '#FFB703',
          'info': '#4280EF',
        },
      },
    },
  },
  plugins: [],
});

