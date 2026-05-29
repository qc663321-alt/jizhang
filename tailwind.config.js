/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cute-pink': '#FFB6C1',
        'cute-green': '#98FB98',
        'cute-cream': '#FFF8DC',
        'cute-purple': '#E6E6FA',
        'cute-orange': '#FFDAB9',
      },
      boxShadow: {
        'cute': '0 4px 15px rgba(255, 182, 193, 0.3)',
        'cute-lg': '0 8px 25px rgba(255, 182, 193, 0.4)',
      },
      borderRadius: {
        'cute': '1rem',
        'cute-lg': '1.5rem',
        'cute-xl': '2rem',
      },
    },
  },
  plugins: [],
}
