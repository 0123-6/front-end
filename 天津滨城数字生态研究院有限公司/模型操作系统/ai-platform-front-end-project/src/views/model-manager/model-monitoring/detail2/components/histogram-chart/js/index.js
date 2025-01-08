export function getHistogramChartConfig(config){

  let title = config.title;
  let date = config.date
  let xList = config.xList;
  let barMaxWidth
  let options = []
  for(let i=0;i<config.yList.length;i++){
    options.push({
      series:[
        {data:config.yList[i].standardNumList},
        {data:config.yList[i].modelOutputValueList}
      ],
    })
  }
  if(xList.length <= 3){
    barMaxWidth = 35
  }else{
    barMaxWidth = 14
  }

  return {
    baseOption: {
      timeline: {
        axisType: 'category',
        autoPlay: false,
        playInterval: 1500,
        lineStyle: {
          color: '#ECEEF5'
        },
        itemStyle: {
          color: '#dae1e9'
        },
        controlStyle: {
          itemSize: 20,
          color: '#d9d9d9',
          borderColor: '#d9d9d9',
          borderWidth: 1
        },
        data:date,
      },
      title: {
        text: title,
        top: 16,
        left: 0,
        textStyle: {
          color: '#262626',
          fontSize: 14,
          fontWeight:600,
        },
      },
      color: ['#FD5E3A','#0164FF'],
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        top: 24,
        itemWidth:12,
        itemHeight:12,
        textStyle:{
          color:'#8C8C8C',
          fontSize:12,
        }
      },
      calculable: true,
      grid: {
        top:56,
        bottom:74,
        left:52,
        right:92,
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisLine: {
          lineStyle: {
            color: '#ECEEF5',
            width: 1
          }
        },
        splitLine: { show: false },
        axisLabel: {
          color: '#8C8C8C',
          interval: 0,
          margin: 8
        },
        axisTick: {
          show:false,
          //x轴刻度相关设置
          alignWithLabel: false,
          interval: 'auto',
          inside: true
        },
        data: xList,
      },
      yAxis: {
        type: 'value',
        min: 0,
        // max: yMax,
        splitNumber: 5,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ECEEF5',
            width: 1
          }
        },
        splitLine: {
          lineStyle: {
            color: '#ECEEF5',
            width: 1
          }
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#8C8C8C',
          formatter: '{value}'
        }
      },
      series: [
        { name: '基准值', type: 'bar', barMaxWidth, },
        { name: '模型输出值', type: 'bar', barMaxWidth, }
      ]
    },
    options,
  }
}
