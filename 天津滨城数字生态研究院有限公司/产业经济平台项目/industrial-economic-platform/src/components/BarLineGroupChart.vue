<template>
  <div class="ee-chart ee-chart--barlinegroup" :class="{ 'is-empty': isShowEmpty }" :style="{ height: height, width: width }">
    <div class="ee-chart__inner" :style="{ height: height, width: width }" />
    <div class="ee-chart__title">{{ title }}</div>
    <div class="ee-chart__empty">暂无数据</div>
  </div>
</template>

<script>
/* eslint-disable */
import mixinChart from '@/utils/mixinChart';

export default {
  name: 'bar-line-group-chart',
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
    // 是否平滑过渡
    isSmooth: {
      type: Boolean,
      default: true
    },
    // 线节点标记
    symbol: {
      type: String,
      default: 'emptyCircle'
    },
    colorList: {
      type: Array,
      default: () => [
        'rgba(92, 130, 223, 1)',
        'rgba(232, 169, 97, 1)',
        'rgba(111, 204, 187, 1)',
        'rgba(137, 126, 220, 1)',
        'rgba(158,209,140, 1)',
        'rgba(225,120,158, 1)'
      ]
    }
  },
  methods: {
    setOptions(data) {
      const self = this;
      const val = typeof data === 'string' ? JSON.parse(data) : data;
      const { title, xdata = [], yNames = [], barData, lineData, unit = [], name, barWidth = 6 } = val;
      this.title = title;
      this.isShowEmpty =
        xdata.length === 0 ||
        (barData.findIndex((n) => n.findIndex((c) => c !== null && c !== '-' && c !== '') > -1) < 0 &&
          lineData.findIndex((n) => n.findIndex((c) => c !== null && c !== '-' && c !== '') > -1) < 0);
      if (this.isShowEmpty) return;
      const series = barData
        .map((n, i) => ({
          name: name[i],
          type: 'bar',
          barWidth,
          barMaxWidth: 30,
          barGap: '66%',
          data: n,
          itemStyle: {
            borderRadius: [5, 5, 0, 0]
          }
        }))
        .concat(
          lineData.map((n, i) => ({
            type: 'line',
            stack: 'Total',
            smooth: this.isSmooth,
            symbol: this.symbol,
            symbolSize: 6,
            yAxisIndex: 1,
            name: name[i],
            data: n,
            zlevel: 2,
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: self.colorList[i % 6].replace('1)', '0.5)')
                },
                {
                  offset: 1,
                  color: self.colorList[i % 6].replace('1)', '0.1)')
                }
              ])
            }
          }))
        );
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
          color: this.colorList,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'none'
            },
            confine: true,
            formatter: (params) => {
              const strs = [`<span class="ee-chart__tip-name">${params[0].name}</span>`];
              params.forEach((n, i) => {
                if (i < params.length / 2) {
                  const marker = `<span class="ee-chart__tip-marker" style="background-color:${n.color}"></span>`;
                  const secondVal = params[i + params.length / 2].value;
                  strs.push(`<span>${marker}</span>
                    <span>${n.seriesName}：</span>
                    <span class="ee-chart__tip-unit">${yNames[0]} </span>
                    <span class="ee-chart__tip-value">${this.$thousands(n.value)}</span>
                    <span class="ee-chart__tip-unit">${this.$isNumber(n.value) ? unit[0] : ''} </span>，
                    <span class="ee-chart__tip-unit">${yNames[1]} </span>
                    <span class="ee-chart__tip-value">${this.$thousands(secondVal)}</span>
                    <span class="ee-chart__tip-unit">${this.$isNumber(secondVal) ? unit[1] : ''} </span>`);
                }
              });
              return strs.join('<br/>');
            }
          },
          legend: {
            top: 48,
            itemWidth: 8,
            itemHeight: 8,
            itemGap: 10,
            borderRadius: 8,
            icon: 'circle'
          },
          grid: {
            left: 30,
            right: 30,
            top: 80,
            bottom: 16,
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: xdata,
              axisLabel: {
                interval: 0,
                color: '#86909C'
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
              alignTicks: true,
              name: this.$formatUnit(unit[0]),
              nameTextStyle: {
                align: 'right',
                padding: [0, 8, 0, 0]
              }
            },
            {
              type: 'value',
              alignTicks: true,
              name: this.$formatUnit(unit[1]),
              nameTextStyle: {
                align: 'left',
                padding: [0, 0, 0, 8]
              }
            }
          ],
          series
        });
      });
    }
  }
};
</script>
<style lang="less" scoped>
