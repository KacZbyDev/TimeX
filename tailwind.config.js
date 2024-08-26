/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./html/*.{html,js}'],
  theme: {
    extend: {
      boxShadow: {
        'custom-amber': '0px 0px 12px 2px',

      },
    },
  },
  plugins: [],
}

