<template>
  <div class="ee-chart ee-chart--barline" :class="{ 'is-empty': isShowEmpty }" :style="{ height: height, width: width }">
    <div class="ee-chart__inner" :style="{ height: height, width: width }" />
    <div class="ee-chart__title">{{ title }}</div>
    <div class="ee-chart__empty">暂无数据</div>
  </div>
</template>

<script>
/* eslint-disable */
import mixinChart from '@/utils/mixinChart';

export default {
  name: 'line-chart',
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
    // 父组件传递过来的图表数据
    chartData: {
      type: Object,
      required: true
    },
    // 是否平滑过渡
    isSmooth: {
      type: Boolean,
      default: true
    },
    // 线节点标记
    symbol: {
      type: String,
      default: 'none'
    },
    colorList: {
      type: Array,
      default: () => ['#356DF6', '#44CCD4']
    },
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    setOptions({ title, xdata = [], ydata, unit, name } = {}) {
      const self = this;
      const { options } = this;
      this.title = title;
      this.isShowEmpty = xdata.length === 0;
      if (this.isShowEmpty) return;
      this.$nextTick(() => {
        this.chart.setOption({
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
              type: 'none'
            },
            formatter: (params) => {
              console.log(params);
              const strs = [`<span class="ee-chart__tip-name">${params[0].name}</span>`];
              params.forEach((n, i) => {
                const marker = `<span class="ee-chart__tip-marker" style="background-color:${n.color}"></span>`;
                strs.push(`<span>${marker}</span>
                    <span class="ee-chart__tip-name">${n.seriesName}：</span>
                    <span class="ee-chart__tip-value">${this.$thousands(n.value)}</span>
                    <span class="ee-chart__tip-unit">${this.$isNumber(n.value) ? unit[i] : ''} </span>`);
              });
              return strs.join('<br/>');
            }
          },
          legend: {
            top: 48
          },
          grid: {
            left: 40,
            right: 40,
            top: 80,
            bottom: 16,
            containLabel: true,
            ...(options.grid || {})
          },
          xAxis: [
            {
              type: 'category',
              data: xdata,
              axisLabel: {
                interval: 0,
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
              alignTicks: true,
              name: this.$formatUnit(unit[0]),
              nameTextStyle: {
                align: 'right',
                padding: [0, 8, 0, 0]
              }
            },
            {
              type: 'value',
              alignTicks: true,
              name: this.$formatUnit(unit[1]),
              nameTextStyle: {
                align: 'left',
                padding: [0, 0, 0, 8]
              }
            }
          ],
          series: [
            {
              type: 'bar',
              // barWidth: '10%',
              barWidth: 16,
              itemStyle: {
                color: self.colorList[0]
              },
              name: name ? name[1] : '',
              data: ydata ? ydata[1] : []
            },
            {
              type: 'line',
              smooth: this.isSmooth,
              symbol: this.symbol,
              itemStyle: {
                color: self.colorList[1]
              },
              areaStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: self.colorList[1] },
                  { offset: 1, color: 'rgba(255,255,255,0.5)' }
                ])
              },
              yAxisIndex: 1,
              name: name ? name[0] : '',
              data: ydata ? ydata[0] : []
            }
          ]
        });
      });
    }
  }
};
</script>
