<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-06-01 16:24:47
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-06-02 15:06:30
 * @FilePath: \ai-platform-front-end-project\src\views\model-manager\model-monitoring\components\lineAreaChart.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="line-area-chart-container">
    <div :id="elId" class="chart-detail" />
  </div>
</template>
<script>
import * as echarts from 'echarts';
import moment from 'moment';
export default {
  props: {
    elId: {
      type: String,
      required: true
    },
    yAxisName: {
      type: String,
      required: true
    },
    detailData: {
      type: Array,
      required: true
    },
    formatSize: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      elChart: null,
      xAxis: [],
      yAxis: [],
      legend: [],
      unit: ''
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.formatData();
    });
  },
  methods: {
    formatData() {
      this.xAxis = [];
      this.yAxis = [];
      this.legend = [];
      const list = this.yAxisName.split('(');
      this.unit = list[1].substring(0, list[1].length - 1);
      this.detailData.map((item) => {
        const xArray = [];
        const yArray = [];
        this.legend.push(item.metric.pod);
        item.values.map((xItem) => {
          xArray.push(moment.unix(xItem[0]).format('HH:mm:ss'));
          yArray.push((xItem[1] / this.formatSize).toFixed(2));
        });
        this.xAxis = xArray;
        this.yAxis.push(yArray);
      });
      this.setChart();
    },
    setChart() {
      let option = null;
      option = {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let relVal = params[0].name;
            for (let i = 0, l = params.length; i < l; i++) {
              relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value + this.unit;
            }
            return relVal;
          }
        },
        legend: {
          data: this.legend,
          icon: 'circle',
          bottom: '8px',
          left: '8px'
        },
        grid: {
          left: '5%',
          right: '5%'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          data: this.xAxis
        },
        yAxis: {
          type: 'value',
          name: this.yAxisName,
          nameTextStyle: {
            fontWeight: 'bolder'
          },
          axisLabel: {
            formatter: (value) => value === 0 ? ' ' : value
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: this.legend[0],
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#94d4b6' },
                  { offset: 0.5, color: '#d3ebee' },
                  { offset: 1, color: '#ffffff' }
                ])
            },
            data: this.yAxis[0]
          },
          {
            name: this.legend[1],
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#4ba9d4' },
                  { offset: 0.5, color: '#d3ebee' },
                  { offset: 1, color: '#ffffff' }
                ])
            },
            data: this.yAxis[1]
          }
        ]
      };
      this.initChart(option);
    },
    initChart(option) {
      const chartDom = document.getElementById(this.elId);
      this.elChart = echarts.init(chartDom);
      option && this.elChart.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
.chart-detail {
  height: 270px;
}
</style>
