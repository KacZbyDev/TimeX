/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './html/*.{html,js}',
    './css/input.css',
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-amber': '0px 0px 12px 2px',

      },

      //secondary is lighter
      colors: {
        'blue-primary': '#2C599D',
        'blue-secondary': '#5B84C4',
        'light-blue-primary': '#80BEED',//maybe a bit too light
        'light-blue-secondary': '#D2EBFF',
        'dark-blue-primary': '#11224D',//very dark
        'dark-blue-secondary': '#193A6F',
  
        'orange-primary': '#F98125',
        'orange-secondary': '#FB9B50'
      },
    },
  },
  plugins: [],
}
