/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yuki: {
          purple: '#7F77DD',
          'purple-dark': '#534AB7',
          'purple-light': '#EEEDFE',
          teal: '#1D9E75',
          'teal-light': '#E1F5EE',
          ink: '#2C2C2A',
          muted: '#888780',
          surface: '#F8F7F4',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
