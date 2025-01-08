/**
 * @param span series 中最大值与最小值的差值
 * @param splitNumber 坐标轴分割段数
 * @param round 折线图中需要传 true
 * @returns {number} 处理后 max 的最后结果
 */
function nice2(span, splitNumber, round) {
  let val = span / splitNumber;
  var exponent = Math.floor(Math.log(val) / Math.LN10);
  var exp10 = Math.pow(10, exponent);
  var f = val / exp10; // 1 <= f < 10

  var nf;

  if (round) {
    if (f < 1.5) {
      nf = 1;
    } else if (f < 2.5) {
      nf = 2;
    } else if (f < 4) {
      nf = 3;
    } else if (f < 7) {
      nf = 5;
    } else {
      nf = 10;
    }
  } else {
    if (f < 1) {
      nf = 1;
    } else if (f < 2) {
      nf = 2;
    } else if (f < 3) {
      nf = 3;
    } else if (f < 5) {
      nf = 5;
    } else {
      nf = 10;
    }
  }

  val = nf * exp10; // Fix 3 * 0.1 === 0.30000000000000004 issue (see IEEE 754).
  // 20 is the uppper bound of toFixed.

  const step = exponent >= -20 ? +val.toFixed(exponent < 0 ? -exponent : 0) : val;

  let result;
  for (let i = splitNumber - 3; i < splitNumber + 3; i++) {
    result = step * i;
    if (result > span) break;
  }

  return result;
}

export function getLineChartConfig(config) {
  const title = config.title;
  const xList = config.xList;
  const yList = config.yList;
  const yMax = config.yMax;
  let standardNum = null;
  const num = config.num;
  let isShowMarkLine = true;
  if (config?.standardNum) {
    standardNum = config?.standardNum;
    yList.push(standardNum);
  } else {
    standardNum = 0;
    isShowMarkLine = false;
  }
  // if(typeof yMax == "undefined"){
  //   yMax = standardNum
  //   for(let i=0;i<yList.length;i++){
  //     if(yMax < yList[i]){
  //       yMax = yList[i]
  //     }
  //   }
  //   if(yMax<=0.25){
  //     yMax = 0.3
  //   }else if(yMax<=1){
  //     yMax += 0.1
  //     yMax = Number(Number(yMax).toFixed(2))
  //   }else {
  //     yMax = undefined
  //   }
  //
  //
  // }

  const colorList = ['#0164FF', '#00B1B2', '#00AB5A'];
  return {
    title: {
      text: title,
      top: 16,
      left: 0,
      textStyle: {
        color: '#262626',
        fontSize: 14,
        fontWeight: 600
      }
    },
    color: [colorList[num - 1]],
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      top: 24,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        color: '#8C8C8C',
        fontSize: 12
      }
    },
    grid: {
      top: 56,
      bottom: 54,
      left: 52,
      right: 92
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: '#ECEEF5',
          width: 1
        }
      },
      axisLabel: {
        color: '#8C8C8C'
      },
      axisTick: {
        show: false
      },
      data: xList
    },
    yAxis: {
      type: 'value',
      min: 0,
      // max:yMax,
      // max: extent => {
      //   const max = extent.max > standardNum ? extent.max : standardNum
      //   return nice2(max, 5, true)
      // },
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
        show: false
      },
      axisLabel: {
        color: '#8C8C8C',
        formatter: '{value}'
      }
    },
    series: [
      {
        name: title,
        type: 'line',
        lineStyle: {
          width: 1.5
        },
        symbol: 'circle',
        symbolSize: 8,
        data: yList,
        markLine: {
          data: [
            {
              yAxis: standardNum,
              name: '基准值',
              label: {
                color: '#FD5E3A',
                formatter: '{b} {c}',
                distance: 8
              }
            }
          ],
          lineStyle: {
            color: '#FD5E3A',
            width: 1.5,
            opacity: isShowMarkLine ? 1 : 0
          },
          silent: true
        }
      }
    ]
  };
}
