/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue}'],
  theme: {
    colors: {
      main: {
        DEFAULT: '#356DF6',
        hover: '#5988FB',
        active: '#2C60DF',
      },
      white: '#FFFFFF',
    },
    fontSize: {
      xs: ['12px', '12px'],
      sm: ['14px', '14px'],
      base: ['16px', '16px'],
      lg: ['18px', '18px'],
      xl: ['20px', '20px']
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  },
  prefix: 'tw-'
};
