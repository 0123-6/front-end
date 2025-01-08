<template>
  <!--最外层-->
  <div ref="outerDiv" />
</template>

<script>
import mixinChart from "@/views/index/mixin/mixinChart";

export default {
  name: 'BarAndLineChart',
  mixins: [mixinChart],
  props: {
    chartData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      yAxisOption: {
        show: true,
        type: 'value',
        splitNumber: 5,
        axisLabel: {
          color: '#929DA3',
          fontFamily: 'D-DIN-N',
          fontSize: 14
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#DBE1E9'
          }
        },
      },
      // 图表的配置项
      chartOptions: {
        grid: {
          top: 55,
          bottom: 36,
          left: 40,
          right: 50,
        },
        xAxis: [
          {
            type: 'category',
            data: this.xList,
            axisTick: {
              show: false
            },
            axisLabel: {
              hideOverlap: true,
              interval: 0,
              // rotate: 30,
              color: '#929DA3',
              fontSize: 14,
              fontFamily: 'D-DIN-N'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#DBE1E9'
              }
            },
            nameTextStyle: {
              fontSize: 14,
              color: '#929DA3',
              padding: [0, 0, 0, -10]
            }
          }
        ],
        yAxis: [
          {
            ...this.yAxisOption,
            name: ' 项目 (个)',
            minInterval: 1,
            nameLocation: 'end',
            nameTextStyle: {
              fontSize: 14,
              color: '#929DA3',
              padding: [0, 0, 10, -30]
            },
            alignTicks: true,
            axisLabel: {
              color: '#929DA3',
              fontFamily: 'D-DIN-N',
              fontSize: 14,
            },
          },
          {
            ...this.yAxisOption,
            name: '百分数',
            // minInterval: 0.1,
            // min: 0,
            // max: 1,
            nameLocation: 'end',
            nameTextStyle: {
              fontSize: 14,
              color: '#929DA3',
              padding: [0, 0, 10, 45],
            },
            axisLabel: {
              color: '#929DA3',
              fontFamily: 'D-DIN-N',
              fontSize: 14,
              formatter: (value) => value * 100 + '%',
            },
          },
        ],
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            label: {
              backgroundColor: '#6a7985'
            },
            lineStyle: {
              color: 'rgba(69, 196, 243, 0.10)',
              width: '26',
              type: 'solid'
            }
          },
          renderMode: 'html',
          className: 'echarts-tooltip--dark',
          formatter: (params, ticket, callback) => {
            console.log('BarAndLineChart', params);
            return `<div class="ddin f14">${params[0].axisValue}</div>
            <div class="f12 mt4">新增项目数量：<span class="f16 ddin">${params[0].value}</span>个</div>
            <div class="f12 mt4">同比增长率：<span class="f16 ddin">${Math.ceil(params[1].value * 100)}</span>%</div>
            <div class="f12 mt4">环比增长率：<span class="f16 ddin">${Math.ceil(params[1].value * 100)}</span>%</div>
                          `;
          }
        },
        series: [
          {
            z: 2,
            name: '新增项目数量',
            data: this.yList,
            type: 'bar',
            barWidth: 20,
            label: {
              show: true,
              color: '#7B7B7B',
              position: 'top',
            },
            itemStyle: {
              color: '#02ADEC',
              borderWidth: 0,
              borderColor: 'white',
            },
            color: ['#02ADEC'],
            selectedMode: true,
            select: {
              label: {
                show: true,
                color: '#02ADEC',
                position: 'top',
              },
              itemStyle: {
                color: '#02ADEC',
                borderWidth: 3,
                borderColor: '#cceffb',
              },
            },
            barMinHeight: 1,
          },
          {
            name: '同比增长率',
            data: this.yList2,
            type: 'line',
            yAxisIndex: 1,
            color: ['#4FE2AD'],
            smooth: true,
            symbol: 'circle',
          },
          {
            name: '环比增长率',
            data: this.yList3,
            type: 'line',
            yAxisIndex: 1,
            color: ['#F0BD5B'],
            smooth: true,
            symbol: 'circle',
          },
        ],
        legend: {
          show: true,
          type: 'plain',
          // itemWidth: 10,
          itemHeight: 10,
          top: 10,
          // data: ['环比增长率', '新增项目数量', '同比增长率', ],
          // 不可点击
          selectedMode: false,
        },
        toolbox: {
          feature: {
            dataZoom: {
              show: false,
              yAxisIndex: 'none'
            },
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 95,
            end: 100,
            minValueSpan: 7,
            maxValueSpan: 7,
            zoomLock: true,
          },
        ],
      },
      selectedIndex: null,
    };
  },
  watch: {
    chartData(newVal, oldVal) {
      // 如果newVal和oldVal相同，说明chartData没有变化，不需要重新渲染
      // if (JSON.stringify(newVal) === JSON.stringify(oldVal)) {
      // 	return;
      // }
      console.log('chartData changed');
      console.log('newVal', newVal);
      console.log('oldVal', oldVal);
      this.init();
    },
  },
  methods: {
    // 取消选中
    downplay() {
      console.log('into downplay');
      console.log('this.selectedIndex', this.selectedIndex);
      this.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: this.selectedIndex,
      });
      this.chart.dispatchAction({
        type: 'unselect',
        seriesIndex: 0,
        dataIndex: this.selectedIndex,
      });
    },
    init() {
      // 初始化xList和yList
      this.xList = this.chartData.map(item => item.x);
      this.yList = this.chartData.map(item => item.y.newItemNumber);
      for (let i = 0; i < this.yList.length; i++) {
        this.yList[i] = {
          value: this.yList[i],
          itemStyle: {
            borderRadius: [10, 10, 0, 0]
          }
        };
      }
      this.yList2 = this.chartData.map(item => item.y.yearOnYearGrowthRate);
      this.yList3 = this.chartData.map(item => item.y.quarterOnQuarterGrowthRate);
      this.downplay();
      this.selectedIndex = null;
      this.chartOptions.xAxis[0].data = this.xList;
      this.chartOptions.series[0].data = this.yList;
      this.chartOptions.series[1].data = this.yList2;
      this.chartOptions.series[2].data = this.yList3;
      this.chart.setOption(this.chartOptions);
    },
    handleClick(index) {
      this.selectedIndex = this.selectedIndex === index ? null : index;
      if (this.selectedIndex !== null) {
        const newXList = this.xList.map((_item, _index) => {
          if (_index === index) {
            return {
              value: _item,
              textStyle: {
                color: '#02ADEC',
              }
            }
          } else {
            return {
              value: _item,
            }
          }
        });
        this.chartOptions.xAxis[0].data = newXList;
      } else {
        this.chartOptions.xAxis[0].data = this.xList;
      }
      this.chart.setOption(this.chartOptions);
      let params = {};
      if (this.selectedIndex !== null) {
        params = {
          timeRange: [
            this?.chartData[this?.selectedIndex]?.other?.beginDate,
            this?.chartData[this?.selectedIndex]?.other?.finishDate,
          ],
          label: this?.chartData[this?.selectedIndex]?.x,
        }
      }
      this.$emit('change', params);
    },
  },
};
</script>

<style lang="scss">
.echarts-tooltip--dark {
  padding-left: 14px !important;
  padding-right: 14px !important;
  border-radius: 8px !important;
  background: #767676 !important;
  color: #fff !important;
  // box-shadow: none !important;
  border: none !important;
}
</style>
