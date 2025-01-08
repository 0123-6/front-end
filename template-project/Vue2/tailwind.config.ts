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
      // 黑色
      black: 'black',
      // 主色
      primary: {
        DEFAULT: '#356df6',
        hover: '#5988FB',
        active: '#2C60DF',
      },
    },
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}
