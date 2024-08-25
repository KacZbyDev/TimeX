/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./html/*.html'],
  theme: {
    //Do we put the colors here so they are the only ones we use?

    extend: {
      //TODO do we use this?
      boxShadow: {
        'custom-amber': '0px 0px 12px 2px'
      },

      colors: {
        "blue-primary": "#2C599D",
        "blue-secondary": "#5B84C4",
        "light-blue-primary": "#80beed",//maybe a bit too light
        "light-blue-secondary": "#d2EBFF",
        "dark-blue-primary": "#193A6F",//very dark
        "dark-blue-secondary": "#11224D",
  
        "orange-primary": "#F98125",
        "orange-secondary": "#FB9B50"
      },
    },
  },
  plugins: [],
}

