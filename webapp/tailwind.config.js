/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'slate-900': '#0c1017', // background
        'slate-800': '#141a24', // surface
        'slate-700': '#2a3444', // border-soft
        'slate-600': '#3d4a5c', // border-hard
        'safety-orange': '#e07a2f', // accent
        'slate-50': '#e8ecf1', // text-primary
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
      }
    },
  },
  plugins: [],
}
