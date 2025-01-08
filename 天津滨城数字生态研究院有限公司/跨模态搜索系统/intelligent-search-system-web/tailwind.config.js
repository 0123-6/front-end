/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,vue}'],
  theme: {
    colors: {
      // Configure your color palette here
      transparent: 'transparent',
      current: 'currentColor',
      blue: {
        DEFAULT: '#0C61AA',
        hover: '#0D7CDB',
        focus: '#095290'
      },
      color2: {
        DEFAULT: '#0C8DAA',
        hover: '#11B2D7',
        focus: '#08778F',
        border: 'rgba(12,97,170,0.13)'
      },
      green: {
        DEFAULT: '#0CAA63',
        hover: '#0CC06F',
        focus: '#089053'
      },
      red: {
        DEFAULT: '#CA360D',
        hover: '#EE3D0C',
        focus: '#AD2B07'
      },
      orange: {
        DEFAULT: '#CA920D',
        hover: '#E4A614',
        focus: '#B2800A'
      },
      black: {
        DEFAULT: '#646464',
        dark: '#262626',
        light: {
          DEFAULT: '#8c8c8c',
          91: '#919399',
          more: '#b7b7b7'
        },
        svg: {
          DEFAULT: '#B0B9C1',
          hover: '#869099'
        },
        real: {
          DEFAULT: '#000000'
        }
      },
      white: {
        DEFAULT: '#FFFFFF',
        opacity: {
          DEFAULT: 'rgba(255,255,255,0.77)'
        },
        button: {
          DEFAULT: '#f8fcfe',
          hover: '#ebf6fc',
          focus: '#dce9f0'
        },
        border: {
          DEFAULT: '#e6f3fa'
        },
        candidate: {
          DEFAULT: '',
          hover: '#eef1f3'
        },
        bg: {
          DEFAULT: '#f2fcff',
          type2: '#f7fbfd'
        },
        divide: {
          DEFAULT: '#f2f2f2'
        },
        card: {
          DEFAULT: '#F6FBFF'
        }
      },
      color3: 'rgb(236, 245, 255)'
    },
    boxShadow: {
      'search-line': '0 0 0 1px #0C61AA, 0 0 0 4px #e0ebf4',
      DEFAULT: '0px 7px 11px 0px rgba(229,236,241,1)',
      card: '0px 9px 15px 0px rgba(229,236,241,1)',
      'card-light': '0px 0px 8px 0px rgba(229,236,241,0.43)',
      'card-hover': '0px 9px 15px 0px rgba(202,210,216,1)',
      button: '0px 4px 8px 0px rgba(12,97,170,0.31)',
      'button-lg': '0 0 0 2px #ffffff,2px 6px 9px 0px rgba(223,235,253,1)',
      dialog: '0px 2px 17px 0px rgba(42,43,45,0.5)'
    },
    fontSize: {
      xs: ['12px', '16px'],
      sm: ['14px', '17px'],
      base: ['16px', '19px'],
      lg: ['18px', '22px'],
      xl: ['20px', '24px']
    },
    extend: {}
  },
  plugins: []
};
