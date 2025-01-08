<template>
  <div class="ee-chart ee-chart--bar" :class="{ 'is-empty': isShowEmpty }" :style="{ height: height, width: width }">
    <div class="ee-chart__inner" :style="{ height: height, width: width }" />
    <div class="ee-chart__title">{{ title }}</div>
    <div class="ee-chart__empty">暂无数据</div>
  </div>
</template>

<script>
/*eslint-disable*/
import mixinChart from '@/utils/mixinChart';
const barBackground = {
  '#356DF6': 'rgba(53, 109, 246, 0.10)',
  '#6bcad2': 'rgba(107,202,210,0.1)',
  '#4170ee': 'rgba(65,112,238,0.1)',
  '#68CD44': 'rgb(104,205,68,0.1)'
};
export default {
  name: 'BaseBarChart',
  mixins: [mixinChart],
  props: {
    // 图表数据
    chartData: {
      type: Object,
      required: true
    },
    className: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#356DF6'
    },
    grid: {
      type: Object,
      default() {
        return {};
      }
    },
    height: {
      type: String,
      default: '350px'
    },
    name: {
      type: String,
      default: ''
    },
    option: {
      type: Object,
      default() {
        return {};
      }
    },
    width: {
      type: String,
      default: '100%'
    }
  },
  methods: {
    setOptions({ title, xdata = [], ydata = [], unit = '', barWidth } = {}) {
      const self = this;
      this.title = title;
      this.isShowEmpty = xdata.length === 0 || ydata.filter((n) => n !== null).length === 0;
      if (this.isShowEmpty) return;
      this.$nextTick(() => {
        this.chart.setOption({
          color: self.color,
          title: {
            text: title,
            padding: 16,
            textStyle: {
              fontSize: 16,
              color: '#1a262c'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              label: {
                backgroundColor: '#6a7985'
              },
              lineStyle: {
                color: barBackground[this.color] || 'rgba(53, 109, 246, 0.10)',
                width: '40',
                type: 'solid'
              }
            },
            formatter: (params) => {
              const marker = `<span class="ee-chart__tip-marker" style="background-color:${this.color}"></span>`;
              return `<span class="ee-chart__tip-name">${params[0].name}</span><br/>
                    <span>${marker}</span>
                    <span class="ee-chart__tip-value">${this.$thousands(params[0].value)}</span><span class="ee-chart__tip-unit">${
                this.$isNumber(params[0].value) ? unit : ''
              } </span>`;
            }
          },
          grid: {
            left: 30,
            right: 30,
            top: 80,
            bottom: 16,
            containLabel: true,
            ...this.grid
          },
          xAxis: [
            {
              type: 'category',
              data: xdata,
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
              barWidth: barWidth || undefined,
              barMaxWidth: 16,
              data: ydata
            }
          ],
          ...this.option
        });
      });
    }
  }
};
</script>
