/** @type {import('tailwindcss').Config} */

import { pagestyle } from './src/styles/forms';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: pagestyle.primary,
        secondary: pagestyle.secondary,
        tertiary: pagestyle.tertiary,
        accent: pagestyle.accent,
      },
      fontFamily: {
        stylish: ['stylish', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
