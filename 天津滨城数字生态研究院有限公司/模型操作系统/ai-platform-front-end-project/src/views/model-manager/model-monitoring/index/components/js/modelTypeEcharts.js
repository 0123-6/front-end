export function getModelTypeEcharts(config){
  let title = config.title
  let data = config.data
  return {
    title: {
      text: title,
      top: 16,
      left: 16,
      textStyle: {
        color: '#262626',
        fontSize: 14,
        fontWeight:600,
      },
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      top: 20,
      bottom: 40,
      left: '55%',
      itemWidth: 12,
      itemHeight: 13,
      textStyle: {
        color: '#646464',
      },
      pageIconColor:'#C2CCDB',
      pageIconInactiveColor:'#DEE7F6',
    },
    series: [
      {
        name: title,
        type: 'pie',
        center: ['50%', '50%'],
        top: 20,
        right: '45%',
        bottom: 20,
        radius: ['55%', '66%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: '600',
            textStyle: {
              color: '#646464',
            }
          },
        },
        labelLine: {
          show: false
        },
        data,
      }
    ]
  };
}
