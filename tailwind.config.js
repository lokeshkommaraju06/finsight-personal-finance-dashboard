/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F5F0',       // app background — warm off-white
        surface: '#FFFFFF',     // cards
        ink: {
          DEFAULT: '#1F2421',   // primary text / sidebar bg
          soft: '#4B534E',      // secondary text
          faint: '#8A8F8A',     // tertiary / placeholder text
        },
        border: '#E6E2D8',
        emerald: {
          DEFAULT: '#2F6F4E',   // income / positive accent
          soft: '#E7F0EA',
        },
        rust: {
          DEFAULT: '#C1553D',   // expense / negative accent
          soft: '#F6E9E5',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(31, 36, 33, 0.04), 0 4px 12px rgba(31, 36, 33, 0.04)',
      },
      borderRadius: {
        xl: '14px',
      },
    },
  },
  plugins: [],
}
