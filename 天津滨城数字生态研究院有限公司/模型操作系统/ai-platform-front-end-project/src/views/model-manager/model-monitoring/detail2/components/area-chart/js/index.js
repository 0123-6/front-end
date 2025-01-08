/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-04-19 10:26:08
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-04-20 10:27:07
 * @FilePath: \ai-platform-front-end-project\src\views\model-manager\model-monitoring\detail2\components\area-chart\js\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function getAreaChartConfig(config) {
  const title = config.title;
  const xList = config.data[0].xList;
  const fontColorList = ['#65a1ff', '#f19b85', '#4cc7c9', '#7bb0fd', '#6ea6ff', '#744fe1', '#7c59e2', '#f0937a', '#5395fe', '#2bbebf', '#35c0c2', '#599afe'];
  const colorList = ['#C6DCFF', '#E9DCDD', '#BEECEC', '#D1E6FB', '#C4DCFF', '#987FE9', '#EEE9FB', '#F0937A', '#8CB8FF', '#D1EEF4', '#ADE6E6', '#C4DEFC'];
  const seriesData = [];
  const color = [];
  config.data.forEach(item => {
    const randomInt = Math.floor(Math.random() * 12); // 生成 0-11 中的整数
    color.push(fontColorList[randomInt]);
    const areaColor = colorList[randomInt];
    seriesData.push(
      {
        name: item.title,
        type: 'line',
        lineStyle: {
          width: 1
        },
        smooth: true,
        showSymbol: false,
        data: item.yList,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: areaColor // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(255, 255, 255, 0.7)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      });
  });
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
    color,
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
    series: seriesData
  };
}
