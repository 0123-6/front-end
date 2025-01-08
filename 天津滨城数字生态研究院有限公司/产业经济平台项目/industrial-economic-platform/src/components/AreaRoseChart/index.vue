<template>
  <div :class="className + ' rose-chart-container'" :style="{ height: height, width: width }" />
</template>

<script>
import { roseColor } from '@/utils/chartColor';

export default {
  name: 'line-chart',
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
      type: Array,
      default() {
        return roseColor;
      }
    },
    legend: {
      type: Object,
      default() {
        return {};
      }
    },
    option: {
      type: Object,
      default() {
        return {};
      }
    },
    hideOverlap: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // Echarts实例
      chart: null
    };
  },
  watch: {
    /* 如果图表数据是后台获取的，监听父组件中的数据变化，重新触发Echarts */
    chartData: {
      deep: true,
      handler(val) {
        if (this.chart) {
          this.chart.clear();
          this.setOptions(val);
        }
      }
    }
  },
  mounted() {
    /* 图表初始化 */
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    /* 释放图表实例 */
    this.chart.dispose();
    /* dispose 会释放内部占用的一些资源和事件绑定，但是解除实例的引用我们是做不到的，所以需要重新赋值为null */
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = this.$echarts.init(this.$el, null, { renderer: 'svg' });
      this.setOptions(this.chartData);
    },
    setOptions({ title, datas } = {}) {
      this.chart.setOption({
        title: {
          show: !!title,
          text: title,
          padding: 16,
          textStyle: {
            fontSize: 16,
            color: '#1a262c'
          }
        },
        color: this.color,
        legend: {
          orient: 'vertical',
          right: '20%',
          top: 'middle',
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 10,
          borderRadius: 8,
          ...this.legend
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        series: [
          {
            type: 'pie',
            center: ['50%', '50%'],
            radius: [50, 140],
            roseType: 'area',
            label: {
              position: 'inner',
              fontSize: 12
            },
            labelLine: {
              show: false
            },
            labelLayout: {
              hideOverlap: this.hideOverlap
            },
            data: datas
          }
        ],
        ...this.option
      });
    }
  }
};
</script>
<style lang="less" scoped>
.rose-chart-container {
  background-color: #ffffff;
}
</style>
