/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      xs: ['12px', '16px'],
      sm: ['14px', '20px'],
      base: ['16px', '24px'],
      lg: ['18px', '28px'],
      xl: ['20px', '28px'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      // 白色
      white: 'white',
      disabled: '#EBEBEB',
      bg: '#F7F7F7',
      // 黑色
      black: 'black',
      // 主色
      primary: {
        DEFAULT: '#3D6FE2',
        hover: '#254BA3',
        active: '#254BA3',
      },
      error: {
        DEFAULT: '#E34D59',
      },
      warning: {
        DEFAULT: '#F89741',
      },
      success: {
        DEFAULT: '#3AC295',
      },
      text: {
        title: '#333333',
        DEFAULT: '#646464',
        desc: '#979797',
        disabled: '#CFD0D3',
      },
    },
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}