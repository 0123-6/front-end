<template>
  <div class="ee-chart ee-chart--waterfall" :class="{ 'is-empty': isShowEmpty }" :style="{ height: height, width: width }">
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
    color: {
      type: String,
      default: '#356DF6'
    }
  },
  methods: {
    setOptions({ title, xdata = [], outsideDatas, insideDatas, unit } = {}) {
      this.title = title;
      this.isShowEmpty = xdata.length === 0;
      if (this.isShowEmpty) return;
      const self = this;
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
            type: 'shadow'
          },
          formatter(params) {
            const tar = params[1];
            return `${tar.name}<br/>在营业企业数量 : ${this.$thousands(tar.value)}家`;
          }
        },
        grid: {
          left: 48,
          right: 48,
          top: 80,
          bottom: 16,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xdata,
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              rotate: 30,
              color: '#86909C',
              show: true
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
            ameTextStyle: {
              align: 'right',
              padding: [0, 8, 0, 0]
            }
          }
        ],
        series: [
          {
            type: 'bar',
            stack: 'Total',
            barWidth: 30,
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent'
            },
            emphasis: {
              itemStyle: {
                borderColor: 'transparent',
                color: 'transparent'
              }
            },
            data: outsideDatas
          },
          {
            type: 'bar',
            stack: 'Total',
            data: insideDatas
          }
        ]
      });
    }
  }
};
</script>
