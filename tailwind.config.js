/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./html/*.html'],
  theme: {
    extend: {
      //TODO do we use this?
      boxShadow: {
        'custom-amber': '0px 0px 12px 2px'
      },

      colors: {
          "blue-primary": "#2C599D",
          "blue-secondary": "#5B84C4",

          "orange-primary": "#F98125",
          "orange-secondary": "#FB9B50"
      }
    },
  },
  plugins: [],
}

