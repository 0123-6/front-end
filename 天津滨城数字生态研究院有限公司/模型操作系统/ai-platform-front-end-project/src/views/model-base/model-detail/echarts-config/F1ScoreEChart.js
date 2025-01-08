const config = {
  grid: {
    top: 10,
    left: 50,
    // right:0,
    width: 168,
    height: 46
  },
  xAxis: {
    type: 'value',
    axisLabel: {
      show: false
    },
    splitLine: {
      show: false
    },
    max: '1'
  },
  label: {
    show: true,
    position: [180, 0],
    formatter: function(params) {
      return params.value * 100 + '%';
    }
  },
  yAxis: {
    type: 'category',
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisLabel: {},
    data: ['精准率', '回报率'],
    inverse: true
    // max: 4
  },
  series: [
    {
      realtimeSort: true,
      data: [0.96, 0.98],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: '#cdcfd1'
      },
      itemStyle: {
        color: '#0164ff'

      },
      barWidth: 8
    }
  ]
};

export default config;
