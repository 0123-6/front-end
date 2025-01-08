<template>
  <div class="ee-chart ee-chart--line" :class="{ 'is-empty': isShowEmpty }" :style="{ height: height, width: width }">
    <div class="ee-chart__inner" :style="{ height: height, width: width }" />
    <div class="ee-chart__title">{{ title }}</div>
    <div class="ee-chart__empty">暂无数据</div>
  </div>
</template>

<script>
/* eslint-disable */
import mixinChart from '@/utils/mixinChart';

export default {
  name: 'BaseLineChart',
  mixins: [mixinChart],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    // 图表数据
    chartData: {
      type: Object,
      required: true
    },
    // 是否平滑过渡
    isSmooth: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: ''
    },
    // 线节点标记
    symbol: {
      type: String,
      default: 'none'
    },
    color: {
      type: String,
      default: '#356DF6'
    },
    backgroundColor: {
      type: Array,
      default: () => ['#356df633', '#356DF600']
    },
    grid: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    setOptions({ title, xdata = [], baseLine, ydata = [], unit = '' } = {}) {
      const self = this;
      this.title = title;
      this.isShowEmpty = xdata.length === 0 || ydata.filter((n) => n !== null).length === 0;
      if (this.isShowEmpty) return;
      this.$nextTick(() => {
        this.chart.setOption({
          color: this.color,
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
              type: 'none',
              label: {
                backgroundColor: '#6a7985'
              }
            },
            formatter: (params) => {
              const marker = `<span class="ee-chart__tip-marker" style="background-color:${this.color}"></span>`;
              return `<span class="ee-chart__tip-name">${params[0].name}</span><br/>
                    <span>${marker}</span>
                    <span class="ee-chart__tip-value">${this.$thousands(params[0].value)}</span>
                    <span class="ee-chart__tip-unit">${this.$isNumber(params[0].value) ? unit : ''}</span>`;
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
                // interval: 0,
                color: '#86909C',
                rotate: 30
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
              }
            }
          ],
          series: [
            {
              type: 'line',
              smooth: this.isSmooth,
              symbol: this.symbol,
              markLine: baseLine
                ? {
                    data: [
                      {
                        yAxis: baseLine
                      }
                    ],
                    label: {
                      normal: {
                        formatter: '标准\n基线'
                      }
                    }
                  }
                : {},
              itemStyle: {
                normal: {
                  areaStyle: {
                    type: 'default'
                  },
                  lineStyle: {
                    color: self.color
                  },
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: self.backgroundColor[0]
                    },
                    {
                      offset: 1,
                      color: self.backgroundColor[1]
                    }
                  ]),
                  borderColor: self.color,
                  borderWidth: 2
                }
              },
              data: ydata
            }
          ]
        });
      });
    }
  }
};
</script>
