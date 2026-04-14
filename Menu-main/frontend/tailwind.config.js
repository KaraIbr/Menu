/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cobalt: {
          DEFAULT: '#0725b0',
          50: '#e6e9f5',
          100: '#c0c8e7',
          200: '#96a4d9',
          300: '#6c80cb',
          400: '#4761bf',
          500: '#2248b3',
          600: '#1a3a8f',
          700: '#122b6b',
          800: '#0a1c47',
          900: '#020d23',
        },
        paper: '#e5ded4',
        ink: '#3e3a36',
        nano: '#f2efea',
      },
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'doodle': '6px 6px 0px 0px #3e3a36',
        'doodle-sm': '4px 4px 0px 0px #3e3a36',
      },
      animation: {
        'pulse-riso': 'pulse-riso 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-riso': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
