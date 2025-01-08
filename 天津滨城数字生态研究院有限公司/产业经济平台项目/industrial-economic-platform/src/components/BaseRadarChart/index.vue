<script>
/*eslint-disable*/
import mixinChart from '@/utils/mixinChart';
export default {
  name: 'radar-chart',
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
    indicator: {
      type: Array,
      default() {
        return [];
      }
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
  methods: {
    initChart() {
      this.chart = this.$echarts.init(this.$el, null, { renderer: 'svg' });
      this.setOptions(this.chartData);
    },
    setOptions({ title, data } = {}) {
      const self = this;
      const radarData = [];
      data.forEach((item) => {
        radarData.push(item.value);
      });
      let options = {
        color: self.color,
        title: {
          text: title || '',
          padding: 16,
          textStyle: {
            fontSize: 16,
            color: '#1a262c'
          }
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
        radar: {
          center: ['50%', '50%'],
          radius: '60%',
          name: {
            textStyle: {
              color: '#1A262C',
              fontSize: '14px'
            }
          },
          indicator: data
        },
        series: []
      };
      if (data.length > 0) {
        options.series = [
          {
            type: 'radar',
            smooth: this.isSmooth,
            symbol: this.symbol,
            areaStyle: {
              normal: {
                opacity: 0.1
              }
            },
            data: [{ value: radarData }]
          }
        ];
      }
      switch (this.className) {
        case 'grow-compare':
          options.color = ['#356DF6', '#1DB440'];
          options.radar.center = ['50%', '58%'];
          options.radar.radius = 110;
          options.radar.axisName = {
            color: '#1A262C'
          };
          options.radar.splitNumber = 6;
          options.radar.shape = 'circle';
          break;
        default:
          break;
      }
      options = {
        ...options,
        ...this.option
      };
      this.chart.setOption(options);
    }
  }
};
</script>

<template>
  <div class="ee-chart ee-chart--radar" :class="className" :style="{ height: height, width: width }"></div>
</template>
