<template>
  <div class="ee-chart ee-chart--bar" :class="{ 'is-empty': showEmpty }">
    <div class="ee-chart__inner" :style="{ height, width }"></div>
    <div class="ee-chart__empty">暂无数据</div>
  </div>
</template>

<script>
/* eslint-disable */
import mixinChart from '@/mixins/mixinChart';
const barBackground = {
  '#356DF6': 'rgba(53, 109, 246, 0.10)',
  '#6bcad2': 'rgba(107,202,210,0.1)',
  '#4170ee': 'rgba(65,112,238,0.1)',
  '#68CD44': 'rgb(104,205,68,0.1)',
  '#02ADEC': 'rgba(2, 173, 236, 0.1)'
};
export default {
  name: 'BarChart',
  mixins: [mixinChart],
  methods: {
    getOptions(data) {
      const { config } = this
      const color = Array.isArray(config.color) ? '#02ADEC' : config.color
      const { seriesData, unit } = data
      const options = {
        color,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            label: {
              backgroundColor: '#6a7985'
            },
            lineStyle: {
              color: barBackground[color] || 'rgba(53, 109, 246, 0.10)',
              width: '40',
              type: 'solid'
            }
          },
          formatter: (params) => {
            const marker = `<span class="ee-chart__tip-marker" style="background-color:${color}"></span>`;
            return `<span class="ee-chart__tip-name">${params[0].name}</span><br/>
                    <span>${marker}</span>
                    <span class="ee-chart__tip-value">${this.$thousands(params[0].value)}</span>
                    <span class="ee-chart__tip-unit">
                      ${this.$isNumber(params[0].value) ? unit : ''} 
                    </span>`;
          }
        },
        grid: {
          left: 30,
          right: 30,
          top: 80,
          bottom: 16,
          containLabel: true,
          ...config.grid
        },
        xAxis: [
          {
            type: 'category',
            data: seriesData.map(n => n.name),
            axisLabel: {
              interval: 0,
              rotate: 30,
              color: '#86909C',
              fontSize: 11
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#C9CDD4'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.$formatUnit(unit),
            nameTextStyle: {
              align: 'right',
              padding: [0, 8, 0, 0]
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#E5E6EB'
              }
            }
          }
        ],
        series: [
          {
            type: 'bar',
            barGap: 20,
            barMaxWidth: 14,
            itemStyle: {
              borderRadius: [7, 7, 0, 0]
            },
            data: seriesData,
            ...config.series
          }
        ]
      }
      return options
    }
  }
};
</script>