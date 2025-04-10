/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          '500': '#3b82f6',
          '800': '#1e40af',
        },
      },
    },
  },
  plugins: [],
} 