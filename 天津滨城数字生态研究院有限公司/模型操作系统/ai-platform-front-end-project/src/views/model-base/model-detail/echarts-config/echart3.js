const ss = [];
for (let i = 0; i <= 1; i += 0.0001) {
  ss.push(Math.sqrt(1 - i * i));
}

const config = {
  grid: {
    top: 10,
    left: 30,
    right: 0,
    bottom: 0,
    width: 110,
    height: 116
  },
  xAxis: {
    type: 'category',
    axisLabel: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    formatter: function(params) {
      return params * 100 + '%';
    }
  },
  series: [
    {
      data: ss,
      type: 'line',
      smooth: true,

      lineStyle: {
        color: '#136fff'
      },
      areaStyle: {
        color: '#d2e4ff'
      }
    }
  ]
};

export default config;
