<template>
  <div class="ee-chart ee-chart--funnel" :class="{ 'is-empty': isShowEmpty }" :style="{ height: height, width: width }">
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
    }
  },
  methods: {
    formatterData(chartData) {
      const newData = {};
      newData.title = chartData.title;
      const colors = ['#F8AA50', '#8AE2F5', '#7BA9F1', '#7D6DF1', '#8660D2', '#497BF6'];
      const colorsLight = ['#f8aa5066', '#8ae2f566', '#7ba9f166', '#7d6df166', '#8660d266', '#497bf666'];
      const colorsLighter = ['#f8aa5000', '#8ae2f500', '#7ba9f100', '#7d6df100', '#7d6df100', '#7d6df100'];
      newData.insideDatas = [];
      newData.outsideLeftDatas = [];
      newData.outsideRightDatas = [];
      chartData?.datas?.forEach((item, index) => {
        newData.insideDatas.push({
          name: item.name,
          value: index + 1,
          itemStyle: {
            color: colors[index]
          }
        });
        newData.outsideLeftDatas.push({
          data: {
            name: item.name,
            value: index + 1,
            num: item.value,
            percentage: Number(parseFloat((item.value * 100) / chartData.totalNum).toFixed(2))
          },
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: '#D1D5DA' // 0% 处的颜色
                },
                {
                  offset: 0.01,
                  color: '#D1D5DA' // 1% 处的颜色
                },
                {
                  offset: 0.011,
                  color: '#d1d5da66' // 1% 处的颜色
                },
                {
                  offset: 1,
                  color: '#d1d5da00' // 100% 处的颜色
                }
              ],
              global: false
            }
          }
        });
        newData.outsideRightDatas.push({
          data: {
            name: item.name,
            value: index + 1,
            num: item.value,
            percentage: `${parseFloat((item.value * 100) / chartData.totalNum).toFixed(2)}%`
          },
          label: {
            color: colors[index],
            textBorderColor: colors[index]
          },
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: colorsLighter[index] // 0% 处的颜色
                },
                {
                  offset: 0.989,
                  color: colorsLight[index] // 1% 处的颜色
                },
                {
                  offset: 0.99,
                  color: colors[index] // 1% 处的颜色
                },
                {
                  offset: 1,
                  color: colors[index] // 0% 处的颜色
                }
              ],
              global: false
            }
          }
        });
      });
      return newData;
    },
    setOptions(val) {
      const { title, insideDatas = [], outsideLeftDatas, outsideRightDatas } = ({} = this.formatterData(val));
      this.title = title;
      this.isShowEmpty = insideDatas.length === 0;
      if (this.isShowEmpty) return;
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
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: 48,
            right: 48,
            top: 80,
            bottom: 16,
            containLabel: true
          },
          series: [
            {
              type: 'funnel',
              sort: 'ascending',
              gap: 2,
              minSize: '100%',
              left: '10%',
              width: '40%',
              z: 1,
              label: {
                position: 'inside',
                color: '#989B9E',
                textBorderColor: '#989B9E',
                padding: [0, 50, 0, 0],
                formatter({ data }) {
                  let ins = '';
                  if (data.data.percentage < 0.01) {
                    ins = '占比小于 {a|0.01}%';
                  } else {
                    ins = `占比  {a|${data.data.percentage}}%`;
                  }
                  return ins;
                },
                rich: {
                  a: {
                    fontSize: 18,
                    fontFamily: 'D-DIN-Bold'
                  }
                }
              },
              data: outsideLeftDatas
            },
            {
              type: 'funnel',
              sort: 'ascending',
              gap: 2,
              minSize: 0,
              left: '35%',
              width: '30%',
              label: {
                position: 'inside',
                color: '#fff'
              },
              data: insideDatas
            },
            {
              type: 'funnel',
              sort: 'ascending',
              gap: 2,
              minSize: '100%',
              left: '50%',
              width: '40%',
              z: 1,
              label: {
                position: 'inside',
                padding: [0, 0, 0, 50],
                formatter({ data }) {
                  const ins = `{a|${data.data.num}}  家`;
                  return ins;
                },
                rich: {
                  a: {
                    fontSize: 18,
                    fontFamily: 'D-DIN-Bold'
                  }
                }
              },
              data: outsideRightDatas
            }
          ]
        });
      });
    }
  }
};
</script>
