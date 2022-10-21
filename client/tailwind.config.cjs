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
          100: 'rgb(244 244 245)',
          200: 'rgb(228 228 231)',
          300: 'rgb(212 212 216)',
          400: 'rgb(161 161 170)',
          500: 'rgb(113 113 122)',
          600: 'rgb(82 82 91)',
          700: 'rgb(63 63 70)',
          750: 'rgb(51 51 56)',
          800: 'rgb(39 39 42)',
          850: 'rgb(32 32 35)',
          900: 'rgb(24 24 27)',
          950: 'rgb(12 12 14)',
        },
        pink: {
          300: 'rgb(237 138 181)',
          400: 'rgb(233 110 164)',
          500: 'rgb(226 74 141)',
          600: 'rgb(219 29 112)',
          700: 'rgb(192 26 98)',
          800: 'rgb(164 22 84)',
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
        slideDownAndFade: {
          '0%': { opacity: 0, transform: 'translateY(-4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        overlayShow: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        contentShow: {
          '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
          '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        slideLeft: 'slideLeft 250ms both ease-in',
        slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('selected', '&[aria-selected="true"]')
      addVariant('radix-checked', '&[data-state="checked"]')
      addVariant('radix-highlighted', '&[data-highlighted]')
      addVariant('radix-tab-active', '&[data-state="active"]')
      addVariant('command-heading', '& [cmdk-group-heading]')
    }),
  ],
}
