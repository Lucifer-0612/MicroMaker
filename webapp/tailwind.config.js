/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'slate-900': '#0c1017', // dark background
        'slate-800': '#141a24', // dark surface
        'slate-700': '#2a3444', // dark border-soft
        'slate-600': '#3d4a5c', // dark border-hard
        'safety-orange': '#e07a2f', // dark accent
        'slate-50': '#e8ecf1', // dark text-primary
        
        // Light Mode (Vanilla Cream)
        'vanilla-bg': '#FFFDE7',
        'vanilla-panel': '#FDFBF0',
        'vanilla-gold': '#E2AC3E',
        'vanilla-bronze': '#8E6B2A',
        'vanilla-text': '#372A1B',
        'vanilla-border': '#EAE1CE', // For subtle borders
      },
      fontFamily: {
        ui: ['Outfit', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        DEFAULT: '0px',
        'md': '0px',
        'lg': '0px',
        'xl': '0px',
        '2xl': '0px',
        '3xl': '0px',
      },
      keyframes: {
        swing: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '5%': { transform: 'rotate(15deg)' },
          '10%': { transform: 'rotate(-10deg)' },
          '15%': { transform: 'rotate(5deg)' },
          '20%': { transform: 'rotate(-2deg)' },
          '25%': { transform: 'rotate(0deg)' },
        }
      },
      animation: {
        swing: 'swing 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
