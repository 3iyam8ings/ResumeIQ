/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neoamber: '#F5C542',
        neocoral: '#F4A09A',
        neomint: '#8FE3B0',
        neosky: '#8ECAE6',
        neopurple: '#9B8CF0',
        neobg: '#FDFBF7'
      },
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'neo-lg': '6px 6px 0px 0px rgba(0, 0, 0, 1)',
      }
    },
  },
  plugins: [],
}
