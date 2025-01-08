
export function handleOption(...res) {
  return {
    grid: {
      top: 10,
      left: 60,
      right: 0,
      bottom: 0,
      width: 400,
      height: 400
    },
    dataset: res.map(item => {
      return {
        source: {
          'x_series': item.x_series,
          'y_series': item.y_series
        }
      };
    }),
    // dataset: [
    //   {
    //     source: {
    //       'x_series': data1.x_series,
    //       'y_series': data1.y_series
    //     }
    //   },
    //   {
    //     source: {
    //       'x_series': data2.x_series,
    //       'y_series': data2.y_series
    //     }
    //   }
    // ],
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
      name: res[0].x_label,
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
      name: res[0].y_label,
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
      data: [res[0].title],
      icon: 'rect',
      itemWidth: 30,
      itemHeight: 3,
      itemGap: 17,
      left: 0,
      bottom: 0,
      itemStyle: {
        color: '#809ece'
      },
      align: 'right'
    }
    ],
    series: res.map((item, index) => {
      return {
        datasetIndex: index,
        name: res[0].title,
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#1e76ff'
        },
        emphasis: {
          focus: 'series'
        },
        showSymbol: false,
        areaStyle: {
          color: '#5A81BEFF'
        }
      };
    })
    // series: [
    //   {
    //     datasetIndex: 0,
    //     name: res[0].title,
    //     type: 'line',
    //     smooth: true,
    //     lineStyle: {
    //       color: '#1e76ff'
    //     },
    //     emphasis: {
    //       focus: 'series'
    //     },
    //     showSymbol: false,
    //     areaStyle: {
    //       color: '#5A81BEFF'
    //     }
    //   },
    //   {
    //     datasetIndex: 1,
    //     name: res[0].title,
    //     type: 'line',
    //     smooth: true,
    //     lineStyle: {
    //       color: '#60d910'
    //     },
    //     emphasis: {
    //       focus: 'series'
    //     },
    //     showSymbol: false,
    //     areaStyle: {
    //       color: '#8BDA57FF'
    //     }
    //   }
    // ]
  };
}
