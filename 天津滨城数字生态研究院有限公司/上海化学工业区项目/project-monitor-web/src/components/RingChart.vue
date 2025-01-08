<template>
  <div class="ee-chart ee-chart--ring relative" :class="{ 'is-empty': showEmpty }">
    <div class="ee-chart__inner" :style="{ height, width }"></div>
    <ChartLegend v-if="!showEmpty" :data="seriesData" :color="config.color" :unit="config.unit"
      :showPercent="config.showLegendPercent" :boldValue="config.boldValue" />
    <div class="ee-chart__empty">暂无数据</div>
  </div>
</template>

<script>
/* eslint-disable */
import mixinChart from '@/mixins/mixinChart';
import ChartLegend from './ChartLegend.vue';

export default {
  name: 'RingChart',
  components: {
    ChartLegend
  },
  mixins: [mixinChart],
  data() {
    return {
      seriesData: [],
    }
  },
  methods: {
    getOptions(data) {
      const { config } = this
      const seriesData = data.seriesData ? JSON.parse(JSON.stringify(data.seriesData)) : []
      const { unit = '' } = config
      const valueWidth = Math.max(...(seriesData.map(n => n.value))).toString().length * 12
      let percentSum = 0
      seriesData.forEach((n, i) => {
        if (n.value > 0) {
          if (i < seriesData.findLastIndex(c => c.value > 0)) {
            n.percent = (n.value * 100 / data.totalNum).toFixed(2)
            percentSum += Number(n.percent)
          } else {
            n.percent = (100 - percentSum).toFixed(2)
          }
        } else {
          n.percent = 0
        }
      })
      this.seriesData = seriesData
      let options = {
        color: config.color,
        tooltip: {
          trigger: 'item',
          renderMode: 'html',
          padding: [8, 14],
          extraCssText: '0px 0px 7px rgba(19, 34, 64, 0.12)',
          formatter: (params, ticket, callback) => {
            // console.log('ring map', params);
            if (params.data.percent === 0) return ''
            return `<div style="color:#86909C;">${params.name}</div>
                          <div style="color:${config.color[params.dataIndex]};">
                          <span class="f-ddin-b" style="font-size:16px;">${(params.data.percent || 0)}</span>
                          <span style="font-size:12px;">%</span>
                          </div>`;
          }
        },
        legend: {
          right: 120,
          top: (this.chart.getHeight() - seriesData.length * 18 - (seriesData.length - 1) * 12) / 2,
          orient: 'vertical',
          selectedMode: false,
          itemGap: 12,
          itemWidth: 8,
          itemHeight: 8,
          icon: 'circle',
          itemStyle: {
            borderWidth: 0
          },
          formatter: (name) => {
            let index = seriesData.findIndex(n => n.name === name);
            if (config.showLegendPercent === false) {
              return `{name|${name}}{split|}{bold|${seriesData[index].value}}${unit ? `{unitDark|${unit}}` : ''}`
            }
            return `{name|${name}}{split|}{normal|${seriesData[index].value}}${unit ? `{unit|${unit}}` : ''}{bold|${seriesData[index].percent}%}`
          },
          textStyle: {
            align: 'right',
            rich: {
              name: {
                fontSize: 14,
                width: config.nameWidth || 66,
                padding: [0, 0, 0, 4],
                align: 'left',
                color: '#4B5666'
              },
              split: {
                width: 1,
                height: 10,
                backgroundColor: '#DBE1E9'
              },
              normal: {
                padding: [0, 0, 0, 10],
                width: config.valueWidth || valueWidth,
                fontSize: 16,
                align: 'right',
                fontFamily: 'D-DIN-n',
                color: '#86909C'
              },
              unit: {
                padding: [0, 10, 0, 0],
                fontSize: 12,
                align: 'left',
                color: '#86909C'
              },
              unitDark: {
                padding: [0, 0, 0, 2],
                fontSize: 12,
                align: 'left',
                color: '#1A262C'
              },
              bold: {
                padding: [0, 0, 0, 10],
                fontSize: 18,
                align: 'right',
                fontFamily: 'D-DIN',
                color: '#1A262C'
              }
            }
          },
          ...config.legend
        },
        series: [
          {
            type: 'pie',
            center: [150, '50%'],
            radius: [70, 90],
            // minAngle: 3,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'center',
              formatter: `{value|${data.totalNum}}\n{name|${data.totalName}}`,
              rich: {
                name: {
                  padding: [5, 0, 0, 0],
                  fontSize: 12,
                  fontFamily: 'PingFang SC',
                  color: '#86909C'
                },
                value: {
                  fontSize: 24,
                  fontFamily: 'D-DIN',
                  color: '#1A262C'
                }
              }
            },
            emphasis: {
              scaleSize: 3,
              label: {
                show: true
              },
              itemStyle: {
                borderWidth: 0,
                opacity: 0.9
              }
            },
            data: seriesData,
            percentPrecision: 0,
            ...config.series
          }
        ]
      }
      return options
    }
  }
};
</script>

<style lang="scss">
.ee-chart--ring {
  .chart-legend {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
}
</style>