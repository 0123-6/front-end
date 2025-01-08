<template>
  <!--最外层-->
  <div ref="outerDiv" />
</template>

<script>
import mixinChart from "@/views/index/mixin/mixinChart";

export default {
  name: 'BarChartHpj',
  mixins: [mixinChart],
  props: {
    chartData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // 图表的配置项
      chartOptions: {
        color: ['#02ADEC'],
        grid: {
          top: 45,
          bottom: 36,
          left: 40,
          right: 60
        },
        xAxis: [
          {
            name: '投资总额\n\n   (万元)',
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
            },
          }
        ],
        yAxis: {
          show: true,
          name: ' 项目 (个)',
          type: 'value',
          splitNumber: 5,
          minInterval: 1,
          nameLocation: 'end',
          nameTextStyle: {
            fontSize: 14,
            color: '#929DA3',
            padding: [0, 0, 0, -30]
          },
          axisLabel: {
            color: '#929DA3',
            fontFamily: 'D-DIN-N',
            fontSize: 14,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#DBE1E9'
            }
          }
        },
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
            console.log('BarChartHpj', params);
            return `<div class="ddin f14">${params[0].axisValue}</div>
            <div class="f12 mt4">项目数量：<span class="f16 ddin">${params[0].value}</span>个</div>
            <div class="f12 mt4">投资总额总和：<span class="f16 ddin">${this.chartData[params[0].dataIndex].other.totalAmount}</span>万元</div>
                          `;
          }
        },
        series: [
          {
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
          }
        ]
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
      this.yList = this.chartData.map(item => item.y);
      for (let i = 0; i < this.yList.length; i++) {
        this.yList[i] = {
          value: this.yList[i],
          itemStyle: {
            borderRadius: [10, 10, 0, 0]
          }
        };
      }
      this.downplay();
      this.selectedIndex = null;
      this.chartOptions.xAxis[0].data = this.xList;
      this.chartOptions.series[0].data = this.yList;
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
          rangeAmount: [
            this?.chartData[this?.selectedIndex]?.other?.minInvestAmount,
            this?.chartData[this?.selectedIndex]?.other?.maxInvestAmount
          ],
        }
      }
      this.$emit('change', params);
    },
  },
};
</script>

<style scoped></style>
