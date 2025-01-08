/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue}'],
  theme: {
    colors: {
      main: {
        DEFAULT: '#02ADEC',
        light: '#E6F7FD',
        hover: '#45C4F3',
        active: '#009ED8',
      },
      yellow: {
        DEFAULT: '#FAB752',
        light: '#FEF3E3',
      },
      red: {
        DEFAULT: '#E85050',
        light: '#FDEDED',
      },
      orange: {
        DEFAULT: '#F28C53',
      },
      green: {
        DEFAULT: '#68CD44',
        light: '#EFFAEC',
      },
      gray: {
        DEFAULT: '#B7C1C5',
      },
      'blue-gray': {
        DEFAULT: '#3478A9',
      },
      black: {
        DEFAULT: '#1A262C',
        two: '#4B5666',
        three: '#929DA3',
        placeholder: '#B0C1CE',
        line: '#DBE1E9',
      },
      white: {
        DEFAULT: '#FFFFFF',
      },
      // blue-gray对应的渐变色
      'blue-gray-gradient': {
        DEFAULT: 'linear-gradient(180deg, #3478A9 0%, #86B3D3 92.99%)',
      },
    },
    fontSize: {
      xs: ['12px', '12px'],
      sm: ['14px', '14px'],
      base: ['16px', '16px'],
      lg: ['18px', '18px'],
      xl: ['20px', '20px']
    },
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false
  },
  // prefix: 'tw-'
};
