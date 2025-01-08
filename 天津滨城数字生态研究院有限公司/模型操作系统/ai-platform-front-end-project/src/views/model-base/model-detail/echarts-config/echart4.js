const ss = [0.95, 0.81, 0.71, 0.67, 0.55, 0.49, 0.38, 0.22, 0.14, 0.03];

const values2 = [0.05, 0.14, 0.22, 0.39, 0.45, 0.53, 0.61, 0.71, 0.84, 0.99];

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
    },
    itemStyle: {}
  },
  legend: [{
    data: ['Recall'],
    icon: 'rect',
    itemWidth: 9,
    itemHeight: 3,
    itemGap: 17,
    left: 20,
    top: 160,
    itemStyle: {
      color: '#fd5e3a'
    }
  },
  {
    data: ['Precision'],
    icon: 'rect',
    itemWidth: 9,
    itemHeight: 3,
    itemGap: 17,
    left: 80,
    top: 160,
    itemStyle: {
      color: '#136fff'
    }
  }
  ],
  series: [
    {
      name: 'Recall',
      data: values2,
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#fd5e3a'
      },

      showSymbol: false
    },
    {
      name: 'Precision',
      data: ss,
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#136fff'
      },
      showSymbol: false
    }
  ]
};

export default config;
