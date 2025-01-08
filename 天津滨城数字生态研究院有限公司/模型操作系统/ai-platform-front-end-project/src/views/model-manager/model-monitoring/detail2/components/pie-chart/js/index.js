/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-04-19 10:26:08
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-04-20 09:44:42
 * @FilePath: \ai-platform-front-end-project\src\views\model-manager\model-monitoring\detail2\components\area-chart\js\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function getPieChartConfig(config) {
  const title = config.title;
  const data = config.data.map((item) => {
    return {
      name: item.title,
      value: item.valueNum
    };
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
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      orient: 'vertical',
      y: 'center', // 延Y轴居中
      x: 'right', // 居右显示
      align: 'left',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        color: '#8C8C8C',
        fontSize: 12
      },
      formatter: function(name) {
        let total = 0;
        let tarValue;
        for (let i = 0; i < data.length; i++) {
          total += data[i].value;
          if (data[i].name === name) {
            tarValue = data[i].value;
          }
        }
        const v = tarValue;
        const p = Math.round(((tarValue / total) * 100));
        // return `<div>123</div>`
        return `${name}  ${v} ${p}%`;
      }
    },
    grid: {
      top: 56,
      bottom: 54,
      left: 52,
      right: 92
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
}
