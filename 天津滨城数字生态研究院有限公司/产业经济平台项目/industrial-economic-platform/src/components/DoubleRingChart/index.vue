<template>
  <div class="ee-chart ee-chart--doublering" :class="{ 'is-empty': isShowEmpty }" :style="{ height: height, width: width }">
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
    colorList: {
      type: Array,
      default: () => ['#356DF6', '#4BD9B7']
    }
  },
  methods: {
    initChart() {
      this.chart = this.$echarts.init(this.$el.querySelector('.ee-chart__inner'), null, { renderer: 'svg' });
      this.setOptions(this.chartData);
      /* 解决饼图hover阴影消失问题 */
      this.chart.on('mouseover', (e) => {
        const op = this.chart.getOption();
        this.chart.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: e.dataIndex,
          color: e.color
        });
        this.chart.dispatchAction({
          type: 'downplay',
          seriesIndex: 1,
          dataIndex: e.dataIndex,
          color: e.color
        });
        this.chart.setOption(op, true);
      });
    },
    setOptions({ title, name, datas = [], totalNum } = {}) {
      this.title = title;
      this.isShowEmpty = totalNum === 0;
      if (this.isShowEmpty) return;
      const self = this;
      // totalNum = 10000000;
      // datas = [9000000, 1000000];
      const numLen = Math.max(datas[0], datas[1]).toString().length;
      const leftIndent = (numLen - 3) * 2;
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
          legend: {
            icon: 'none',
            left: `${46 - leftIndent}%`,
            top: '25%',
            itemGap: 70,
            textStyle: {
              fontSize: 14,
              rich: {
                name: {
                  color: '#4E5969',
                  padding: [0, 0, 0, 0]
                },
                percent: {
                  color: '#4B5666',
                  fontSize: numLen > 3 ? 34 : 36,
                  padding: [10, 0, 20, 0],
                  fontFamily: 'D-DIN-Bold'
                }
              },
              overflow: 'break'
            },
            selectedMode: false,
            formatter: (params) => {
              const index = name.findIndex((v) => v === params);
              return `{name| ${params}}\n{percent|${datas[index]}}件`;
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
          grid: {
            left: 48,
            right: 48,
            top: 80,
            bottom: 16,
            containLabel: true
          },
          series: datas?.map((item, index) => ({
            type: 'pie',
            radius: ['35', '50'],
            center: [`${38 - leftIndent}%`, `${35 * (index + 1)}%`],
            hoverAnimation: false,
            label: {
              position: 'center'
            },
            data: [
              {
                // 数据环
                value: parseFloat((item * 100) / totalNum).toFixed(2),
                name: name[index],
                itemStyle: {
                  borderRadius: 7,
                  color: self.colorList[index]
                },
                label: {
                  show: false
                }
              },
              // 透明环
              {
                value: parseFloat(((totalNum - item) * 100) / totalNum).toFixed(2),
                tooltip: {
                  show: false
                },
                itemStyle: {
                  color: '#edf1f4'
                },
                label: {
                  formatter: `${parseFloat((item * 100) / totalNum).toFixed(2)}%`,
                  textStyle: {
                    color: self.colorList[index]
                  }
                }
              }
            ]
          }))
        });
      });
    }
  }
};
</script>
<style lang="less" scoped>
.ring-chart-container {
  background-color: #ffffff;
}
</style>
