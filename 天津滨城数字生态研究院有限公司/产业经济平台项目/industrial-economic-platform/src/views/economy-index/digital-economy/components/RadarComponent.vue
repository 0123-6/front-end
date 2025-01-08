<template>
  <div :class="className + ' radar-chart-container'" :style="{ height: height, width: width }" />
</template>

<script>
import { defineComponent } from 'vue';
import * as echarts from 'echarts';

export default defineComponent({
  name: 'RadarComponent',
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
    color: {
      type: String,
      default: '#356DF6'
    },
    option: {
      type: Object,
      default() {
        return {};
      }
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
        this.chart.clear();
        this.setOptions(val);
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
      this.chart = echarts.init(this.$el);
      this.setOptions(this.chartData);
    },
    setOptions({ title, data } = {}) {
      console.log('ssssssssssssssss');
      const self = this;
      let options = {
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
          // trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        series: [
          {
            type: 'radar',
            smooth: this.isSmooth,
            symbol: this.symbol,
            data
          }
        ],
      };
      options = {
        ...options,
        ...this.option,
      };
      this.chart.setOption(options);
    }
  }
});
</script>

<style scoped lang="less">
.radar-chart-container {
  background: #fff;
}
</style>
