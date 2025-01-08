<template>
  <div
    class="ee-chart ee-chart--bargroup"
    :class="{ 'is-empty': isShowEmpty, 'use-dom-title': options.domTitle }"
    :style="{ width: width, minHeight: height }">
    <div class="ee-chart__title">
      <span>{{ title }}</span>
      <slot></slot>
    </div>
    <div class="ee-chart__inner" :style="{ height: height, width: width }" />
    <div class="ee-chart__empty">暂无数据</div>
  </div>
</template>

<script>
/* eslint-disable */
import mixinChart from '@/utils/mixinChart';

export default {
  name: 'bar-group-chart',
  mixins: [mixinChart],
  props: {
    showCross: {
      type: Boolean,
      default: true
    },
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
      type: [Object, String],
      default() {
        return {};
      }
    },
    color: {
      type: Array,
      default() {
        return ['#5C82DF', '#E8A961', '#6FCCBB', '#897EDC', '#9ED18C', '#E1789E'];
      }
    },
    stack: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: 'X'
    },
    seriesItemStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    grid: {
      type: Object,
      default() {
        return {};
      }
    },
    xAxisLabel: {
      type: Object,
      default() {
        return {};
      }
    },
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    setOptions(data) {
      const val = typeof data === 'string' ? JSON.parse(data) : data;
      const { title, legend, xdata = [], ydata = [], unit = '', barWidth = 6 } = val;
      this.title = title;
      this.isShowEmpty = xdata.length === 0 || ydata.findIndex((n) => n.findIndex((c) => c !== null && c !== '' && c !== '-') > -1) < 0;
      if (this.isShowEmpty) return;
      const options = {
        color: this.color,
        title: {
          text: title,
          padding: 16,
          textStyle: {
            fontSize: 16,
            color: '#1a262c'
          },
          ...(this.options.title || {})
        },
        legend: {
          data: legend,
          top: 40,
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 10,
          borderRadius: 8,
          icon: 'circle',
          ...(this.options.legend || {})
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // type: this.showCross ? 'cross' : 'line',
            type: 'none',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: (params) => {
            const strs = [`<span class="ee-chart__tip-name">${params[0].name}</span>`];
            params.forEach((n) => {
              const marker = `<span class="ee-chart__tip-marker" style="background-color:${n.color}"></span>`;
              strs.push(`<span>${marker}</span>
                    <span>${n.seriesName}：</span>
                    <span class="ee-chart__tip-value">${this.$thousands(n.value)}</span><span class="ee-chart__tip-unit">${
                this.$isNumber(n.value) ? unit : ''
              }</span>`);
            });
            return strs.join('<br/>');
          }
        },
        grid: {
          left: 30,
          right: 30,
          top: 100,
          bottom: 16,
          containLabel: true,
          ...this.grid,
          ...(this.options.grid || {})
        },
        xAxis: [
          {
            type: 'category',
            data: xdata,
            axisLabel: {
              interval: 0,
              color: '#86909C',
              ...this.xAxisLabel
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
            ...(this.options.yAxis || {})
          }
        ],
        series: ydata.map((n, i) => ({
          name: typeof legend[i] === 'string' ? legend[i] : legend[i].name,
          type: 'bar',
          stack: this.stack || undefined,
          barWidth,
          barMaxWidth: 30,
          barGap: '66%',
          data: n,
          itemStyle: {
            borderRadius: [5, 5, 0, 0],
            ...this.seriesItemStyle
          }
        })),
        ...this.option
      };
      if (this.direction === 'Y') {
        options.xAxis = {
          type: 'value'
        };
        options.yAxis = {
          type: 'category',
          data: xdata,
          axisLabel: {
            interval: 0
          },
          axisTick: {
            show: false
          }
        };
      }
      // console.log(options);
      this.$nextTick(() => {
        this.chart.setOption(options);
      });
    }
  }
};
</script>
