/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      keyframes: {
        grab: {
          '0%': { cursor: 'grab' },
          '100%': { cursor: 'grabbing' }
        },
        release: {
          '0%': { cursor: 'grabbing' },
          '100%': { cursor: 'grab' }
        }
      },
      animation: {
        grab: 'grab 0.3s ease-out forwards',
        release: 'release 0.3s ease-out forwards'
      }
    }
  },
  plugins: [],
}
