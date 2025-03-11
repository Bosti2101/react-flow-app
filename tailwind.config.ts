module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#ffffff',
        primary: '#000000',
        secondary: '#ffffff',
      },
      backgroundColor: {
        default: '#000000',
      },
      textColor: {
        default: '#ffffff',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
