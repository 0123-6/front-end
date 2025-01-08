<template>
  <div
    class="ee-chart ee-chart--linegroup"
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
  name: 'multiple-line-chart',
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
    // 线节点标记
    symbol: {
      type: String,
      default: 'none'
    },
    colorList: {
      type: Array,
      default: () => ['#356DF6', '#8C7BF1', '#D260B2']
    },
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    setOptions({ title, xdata = [], ydata = [], unit = '', name } = {}) {
      const self = this;
      this.title = title;
      this.isShowEmpty = xdata.length === 0 || ydata.findIndex((n) => n.findIndex((c) => c !== null && c !== '') > -1) < 0;
      if (this.isShowEmpty) return;
      this.$nextTick(() => {
        this.chart.setOption({
          title: {
            text: title,
            padding: 16,
            textStyle: {
              fontSize: 16,
              color: '#1a262c'
            },
            ...(this.options.title || {})
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'none'
            },
            formatter: (params) => {
              const tooltipTitle = `<span class="ee-chart__tip-name">${params[0].name}</span><br/>`;
              const tooltipContent = params.map(
                (item) => `<span>${item.marker}</span>
                        <span class="ee-chart__tip-name">${item.seriesName}</span>
                        <span class="ee-chart__tip-value">${this.$thousands(item.value)}</span><span class="ee-chart__tip-unit">${
                  this.$isNumber(item.value) ? unit : ''
                }</span><br>`
              );
              return tooltipTitle + tooltipContent.join('');
            }
          },
          legend: {
            right: 48,
            top: 48,
            ...(this.options.legend || {})
          },
          grid: {
            left: 30,
            right: 30,
            top: 80,
            bottom: 16,
            containLabel: true,
            ...(this.options.grid || {})
          },
          xAxis: [
            {
              type: 'category',
              data: xdata,
              axisLabel: {
                // interval: 0,
                color: '#86909C',
                rotate: typeof this.options.axisLabelRotate === 'undefined' ? 30 : this.options.axisLabelRotate
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
          series: ydata?.map((item, index) => ({
            itemStyle: {
              color: self.colorList[index]
            },
            type: 'line',
            name: name[index],
            smooth: self.isSmooth,
            symbol: self.symbol,
            symbolSize: 6,
            data: item
          }))
        });
      });
    }
  }
};
</script>
