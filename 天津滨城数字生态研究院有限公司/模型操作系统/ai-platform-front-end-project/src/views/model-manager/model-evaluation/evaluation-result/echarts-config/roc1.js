
export function handleOption(data) {
  return {
    grid: {
      top: 10,
      left: 60,
      right: 0,
      bottom: 0,
      width: 400,
      height: 400
    },
    dataset: {
      source: {
        'x_series': data.x_series,
        'y_series': data.y_series
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    xAxis: {
      type: 'value',
      name: data.x_label,
      nameLocation: 'middle',
      boundaryGap: false,
      nameGap: 30,
      axisTick: {
        show: false
      },
      axisLine: {
        show: true
      }
    },
    yAxis: {
      type: 'value',
      name: data.y_label,
      nameLocation: 'middle',
      nameGap: 30,
      itemStyle: {},
      axisLine: {
        show: true,
        color: '#d0d6de'
      },
      splitLine: {
        show: false
      }
    },
    legend: [{
      data: [data.title],
      icon: 'rect',
      itemWidth: 30,
      itemHeight: 3,
      itemGap: 17,
      left: 0,
      bottom: 0,
      itemStyle: {
        color: '#136fff'
      },
      align: 'right'
    }
    ],
    series: [
      {
        name: data.title,
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#136fff'
        },
        showSymbol: false,
        areaStyle: {}
      }
    ]
  };
}
