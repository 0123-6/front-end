<template>
  <div class="ee-chart ee-chart--scatter" :class="{ 'is-empty': isShowEmpty }" :style="{ height: height, width: width }">
    <div class="ee-chart__inner" :style="{ height: height, width: width }" />
    <div class="ee-chart__title">{{ title }}</div>
    <div class="ee-chart__empty">暂无数据</div>
  </div>
</template>

<script>
/* eslint-disable */
import mixinChart from '@/utils/mixinChart';

export default {
  name: 'common-chart',
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
      type: [Object, String],
      default() {
        return {};
      }
    },
    option: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    setOptions(data) {
      const val = typeof data === 'string' ? JSON.parse(data) : data;
      console.log('ssssssss');
      console.log('val: ', val);
      const { title = '', xdata = [], ydata = [] } = val;
      this.title = title;
      this.isShowEmpty = xdata.length === 0;
      if (this.isShowEmpty) return;
      const self = this;
      const options = {
        // color: self.color,
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
          }
        },
        grid: {
          left: 48,
          right: 48,
          top: 100,
          bottom: 16,
          containLabel: true
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
            name: '',
            nameTextStyle: {
              align: 'center'
            }
          }
        ],
        series: ydata.map((n, i) => ({
          type: 'scatter',
          data: n,
          label: {
            show: true,
            color: '#4B5666',
            fontSize: 12
          },
          symbolSize: (value) => Math.max(value * 70, 30),
          itemStyle: {
            // shadowBlur: 10,
            // shadowColor: 'rgba(25, 100, 150, 0.5)',
            // shadowOffsetY: 5,
            color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 1, [
              // { offset: 0, color: 'rgba(130, 180, 255, 0.30)' },
              // { offset: 1, color: 'rgba(51, 133, 255, 0.30)' }
              { offset: 0, color: 'rgba(92,130,223,0.05)' },
              { offset: 1, color: 'rgba(92,130,223,0.61)' }
            ])
          }
        })),
        ...this.option
      };
      this.$nextTick(() => {
        this.chart.setOption(options);
      });
    }
  }
};
</script>
