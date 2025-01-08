/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    colors: {
      // Configure your color palette here
      transparent: 'transparent',
      current: 'currentColor',
      main: {
        DEFAULT: '#2554FF',//
        hover: {
          DEFAULT: '#4168F5',
        },//已配置到antd
        focus: '#0037FF',//
      },
      blue: {
        DEFAULT: '#4A83D6',
        hover: '#3964A4',
        focus: '#244471',
        icon: {
          DEFAULT: '#3683DD',
          hover: '#3964A4',
          focus: '#244471',
        }
      },
      purple: {
        DEFAULT: '#844AD6',
        hover: '#844AD6',
        focus: '#844AD6'
      },
      red: {
        DEFAULT: '#EC1515',//
        hover: '#F13D3D',//
        focus: '#CF0C0C'//
      },
      green: {
        DEFAULT: '#52C5A8',//
        hover: '#44A38B',//
        focus: '#3B9780'//
      },
      yellow: {
        DEFAULT: '#E4C140',
        hover: '#CAAB3B',
        focus: '#BEA139'
      },
      orange: {
        DEFAULT: '#E57F3F',//
        hover: '#CA6D32',//
        focus: '#B5602B'//
      },
      black: {
        DEFAULT: '#646464',//已配置到antd
        dark: '#262626',//已配置到antd
        light: {
          DEFAULT: '#8c8c8c',//已配置到antd
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
        table: '#f9fafa',
        button: {
          DEFAULT: '#f8fcfe',
          hover: '#ebf6fc',
          focus: '#dce9f0'
        },
        border: {
          DEFAULT: '#F5F5F5'
        },
        candidate: {
          DEFAULT: '',
          hover: '#eef1f3'
        },
        bg: {
          DEFAULT: '#f5f5f5',
          person: 'rgba(77,169,180,0.07)',
        },
        divide: {
          DEFAULT: '#f2f2f2'//已配置到antd
        },
        card: {
          DEFAULT: '#F6FBFF'
        },
        icon: {
          DEFAULT: '#A1A1A1'
        },
        svg: {
          DEFAULT:'#E4E4E4',
          hover: '#C1C5C8',
          experiment: {
            DEFAULT: '#CEDCDE',
            // hover: '#B6C5C7'
            hover: '#CEDCDE'
          }
        },
        search: {
          DEFAULT: '#E9EEEF',
          hover: ''
        },
        disable: {
          e6: '#e6e6e6',
          bg: '#E5E5E5',
          text: '#B7B7B7'
        }
      },
      color3: 'rgb(236, 245, 255)',
      my: {

      },
      close: {
        DEFAULT: '#A09D9D'
      },
      table: {
        icon: {
          // DEFAULT: '#8D95B2',
          DEFAULT: '#A8AFAF',
          disable: '#d4d4d4',
        }
      },
      status: {
        notrun: {
          DEFAULT: '#62697F',
          bg: '#eaeaee'
        },
        stop: {
          DEFAULT: '#E57F3F',
          bg: '#f7e9d9',
        },
        orange: {
          DEFAULT: '#E57F3F',
          bg: '#f7e9d9',
        },
        running: {
          DEFAULT: '#4A83D6',
          bg: '#e6eefa',
        },
        blue: {
          DEFAULT: '#4A83D6',
          bg: '#e6eefa',
        },
        success: {
          DEFAULT: '#52C5A8',
          bg: '#e1f2ee'
        },
        error: {
          DEFAULT: '#F06B7C',
          bg: '#fdebed',
        },
        purple: {
          DEFAULT: '#844AD6',
          bg: '#eee6fa',
        },
        white: {
          DEFAULT: '#B7B7B7',
          bg: '#f0f2f2',
        },
      },
      xflow: {
        DEFAULT: '#fdfdfd',
        a: '#fcfcfc',
      },
      return: {
        DEFAULT: '#F3F4F5',
      },
      header: {
        DEFAULT: '#11A7B2',
      },
    },
    boxShadow: {
      // 'my-header': '0px 4px 8px 0px rgba(232,240,240,1)',
      'my-header': '0 0 12px rgba(0,0,0,.16)',
      'button' : '0px 2px 4px 0px rgba(187,203,221,0.47)',
      'search-line': '0 0 0 1px #0C61AA, 0 0 0 4px #e0ebf4',
      DEFAULT: '0px 7px 11px 0px rgba(229,236,241,1)',
      card: '0px 2px 8px 0px rgba(220,229,231,1)',
      'card-hover': '0px 2px 16px 0px rgba(176,185,188,1)',
      button2: '0px 4px 8px 0px rgba(12,97,170,0.31)',
      'button-lg': '0 0 0 2px #ffffff,2px 6px 9px 0px rgba(223,235,253,1)',
      dialog: '0px 2px 17px 0px rgba(42,43,45,0.5)'
    },
    // fontSizeOld: {
    //   xs: ['12px', '16px'],
    //   sm: ['14px', '17px'],
    //   base: ['16px', '20px'],
    //   lg: ['18px', '22px'],
    //   xl: ['20px', '24px']
    // },
    fontSize: {
      xs: ['12px', '12px'],
      sm: ['14px', '14px'],
      base: ['16px', '16px'],
      lg: ['18px', '18px'],
      xl: ['20px', '20px']
    },
    screens: {
      'big': '1440px',
      'normal': '880px',
    },
    extend: {}
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
};
