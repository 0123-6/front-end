<template>
  <div class="ee-chart ee-chart--totalbar" :class="{ 'is-empty': isShowEmpty }" :style="{ height: height, width: width }">
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
      default: () => ['#D260B2', '#68CD44', '#F8AA50', '#E7C961', '#8AE2F5', '#7D6DF1', '#6740B6', '#7BA9F1', '#356DF6', '#084695']
    }
  },
  methods: {
    setOptions({ title, xdata, ydata = [], unit } = {}) {
      this.title = title;
      this.isShowEmpty = ydata.length === 0|| ydata.findIndex((n) => n.value.findIndex((c) => c !== null && c !== '' && c !== '-') > -1) < 0;
      if (this.isShowEmpty) return;
      const self = this;
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
            top: 30,
            right: 16,
            width: '70%',
            type: 'scroll',
            itemGap: 10
            // formatter: ['{a|{name}}'].join('\n'),
            // textStyle: {
            //   rich: {
            //     a: {
            //       width: 55,
            //       fontSize: 12,
            //       lineHeight: 12
            //     }
            //   }
            // }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'none'
            },
            formatter: (params) => {
              const strs = [`<span class="ee-chart__tip-name">${params[0].name}</span>`];
              params.forEach((n) => {
                const marker = `<span class="ee-chart__tip-marker" style="background-color:${n.color}"></span>`;
                strs.push(`<span>${marker}</span>
                      <span>${n.seriesName}：</span>
                      <span class="ee-chart__tip-value">${this.$thousands(n.value)}</span><span class="ee-chart__tip-unit">${
                  this.$isNumber(n.value) ? unit : ''
                }</span>`);
              });
              return strs.join('<br/>');
            }
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
                color: '#86909C',
                rotate: 30
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
              name: this.$formatUnit(unit),
              nameTextStyle: {
                align: 'right',
                padding: [0, 8, 0, 0]
              }
            }
          ],
          series: ydata?.map((item, index) => ({
            name: item.name,
            itemStyle: {
              color: self.colorList[index]
            },
            type: 'bar',
            barWidth: '30%',
            barMaxWidth: 30,
            barMinWidth: 10,
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            data: item.value
          }))
        });
      });
    }
  }
};
</script>
