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
        'blue-light-primary': '#80BEED',
        'blue-light-secondary': '#bfdbfe',
        'blue-dark-primary': '#11224D',
        'blue-dark-secondary': '#193A6F',
  
        'orange-primary': '#F98125',
        'orange-secondary': '#FB9B50',
        'orange-light-primary': '#FFB668',
        'orange-light-secondary': '#FFD8B1',
        'orange-dark-primary': '#B84E0F',
        'orange-dark-secondary': '#D5621A', 
        // Old colors
        // 'blue-primary': '#2C599D',
        // 'blue-secondary': '#5B84C4',
        // 'blue-light-primary': '#80BEED',//maybe a bit too light
        // 'blue-light-secondary': '#D2EBFF',
        // 'blue-dark-primary': '#11224D',//very dark
        // 'blue-dark-secondary': '#193A6F',
      },
    },
  },
  plugins: [],
}
