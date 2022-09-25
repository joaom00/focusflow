const plugin = require('tailwindcss/plugin')
const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        bungee: 'Bungee',
      },
      colors: {
        gray: {
          400: 'rgb(161 161 170)',
          700: 'rgb(63 63 70)',
          750: 'rgb(51 51 56)',
          800: 'rgb(39 39 42)',
          900: 'rgb(24 24 27)',
        },
        pink: {
          500: 'rgb(226 74 141)',
          600: 'rgb(219 29 112)',
        },
      },
      keyframes: {
        slideLeft: {
          '0%': {
            transform: 'translateX(100%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
      },
      animation: {
        slideLeft: 'slideLeft 250ms both ease-in',
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('selected', '&[aria-selected="true"]')
      addVariant('radix-checked', '&[data-state="checked"]')
      addVariant('command-heading', '& [cmdk-group-heading]')
    }),
  ],
}
