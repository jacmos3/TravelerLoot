/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['EB Garamond', 'serif'],
        body: ['Inconsolata', 'monospace'],
      },
      colors: {
        gray: {
          100: '#edece9',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#161619',
          1000: '#0e0e0e',
          PLATINUM: '#D5D6D8'
        },
        blue: {
          1: "#1B2837",
          2: "#2F4660",
          3: "#0F2854",
          4: "#42648A",
          5: "#456990",
          6: "#467494",
          7: "#467F97",
          8: "#5A82AF",
          9: "#83A1C3",
          10: "#47949D",
          11: "#48A9A4",
          12: "#49BEAA",
          13: "#3FCAAA",
          14: "#27CE9C",
          COLORED: "#83A1C3"
        }
      },
      minHeight: {
        0: '0',
        45: '45px',
        '1/4': '25vh',
        '1/2': '50vh',
        '3/4': '75vh',
        full: '100vh',
      },
    },
  },
  plugins: [],
}
