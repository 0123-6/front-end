<template>
  <div class="ee-chart ee-chart--barradar" :class="{ 'is-empty': isShowEmpty }" :style="{ height: height, width: width }">
    <div class="ee-chart__inner" :style="{ height: height, width: width }" />
    <div class="ee-chart__title">{{ title }}</div>
    <div class="ee-chart__empty">暂无数据</div>
  </div>
</template>

<script>
/*eslint-disable*/
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
      default: '550px'
    },
    // 父组件传递过来的图表数据
    chartData: {
      type: Object,
      required: true
    }
  },
  methods: {
    setOptions({ title, datas = [] } = {}) {
      this.title = title;
      this.isShowEmpty = datas.length === 0;
      if (this.isShowEmpty) return;
      const radarData = [];
      datas.forEach((item) => {
        radarData.push(item.value);
      });
      const options = {
        color: ['#356DF6'],
        title: {
          text: title,
          padding: [16, 48]
        },
        tooltip: {}, // 不能加，不然
        grid: {
          left: '50%',
          right: 48,
          top: 80,
          bottom: 16,
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'value'
        },
        yAxis: {
          type: 'category',
          show: false,
          data: datas.map((item) => item.name).reverse()
        },
        radar: {
          center: ['50%', '50%'],
          radius: '60%',
          name: {
            textStyle: {
              color: '#1A262C',
              fontFamily: 'PingFang SC',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 400
            }
          },
          indicator: datas
        },
        series: []
      };
      if (radarData.length > 0) {
        options.series = [
          {
            radarIndex: 0,
            type: 'radar',
            areaStyle: {
              normal: {
                opacity: 0.1
              }
            },
            data: [{ value: radarData }]
          }
          // {
          //   type: 'bar',
          //   zlevel: 1,
          //   silent: false,
          //   label: {
          //     color: '#444444',
          //     show: true,
          //     position: [0, '-20px'],
          //     textStyle: {
          //       fontSize: 16
          //     },
          //     formatter(a) {
          //       return a.name;
          //     }
          //   },
          //   itemStyle: {
          //     normal: {
          //       barBorderRadius: 30
          //     }
          //   },
          //   barWidth: 16,
          //   data: radarData.reverse()
          // },
          // {
          //   type: 'bar',
          //   barWidth: 16,
          //   barGap: '-100%',
          //   label: {
          //     show: true,
          //     color: '#444444',
          //     position: ['100%', '-20px'],
          //     textStyle: {
          //       fontSize: 16
          //     },
          //     formatter(a) {
          //       return radarData[a.dataIndex];
          //     }
          //   },
          //   data: datas.map((item) => item.max),
          //   itemStyle: {
          //     normal: {
          //       color: '#f3f3f7',
          //       barBorderRadius: 30
          //     }
          //   }
          // }
        ];
      }
      this.$nextTick(() => {
        this.chart.setOption(options);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.radar-chart-container {
  background-color: #ffffff;
  //box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
</style>
