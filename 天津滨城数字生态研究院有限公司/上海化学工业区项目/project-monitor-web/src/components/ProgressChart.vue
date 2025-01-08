<template>
  <div class="ee-chart ee-chart--progress" :class="{ 'is-empty': showEmpty }" style="pointer-events: none;">
    <div class="ee-chart__inner" :style="{ height, width }"></div>
    <div class="ee-chart__empty">暂无数据</div>
  </div>
</template>

<script>
/* eslint-disable */
import mixinChart from '@/mixins/mixinChart';

export default {
  name: 'ProgressChart',
  mixins: [mixinChart],
  methods: {
    getOptions(data) {
      const { config } = this
      const { percent } = data
      const radiusGroup = [
        // 进度
        ['75%', '94%'],
        // 背景
        ['77%', '92%'],
        // 线环
        ['71%', '72%'],
      ]
      let options = {
        tooltip: {
          trigger: 'none'
        },
        series: [
          {
            name: '0',
            type: 'pie',
            z: 2,
            radius: radiusGroup[0],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'center',
              formatter: `{value|${percent}}{unit|%}\n{name|总体进度}`,
              rich: {
                name: {
                  padding: [2, 0, 0, 0],
                  fontSize: 12,
                  fontFamily: 'PingFang SC',
                  color: '#86909C'
                },
                unit: {
                  fontSize: 14,
                  fontFamily: 'D-DIN',
                  color: '#387BAB'
                },
                value: {
                  fontSize: 28,
                  fontFamily: 'D-DIN',
                  color: '#387BAB'
                }
              }
            },
            labelLine: {
              show: false
            },
            emphasis: {
              scale: false
            },
            data: [
              {
                value: percent,
                itemStyle: {
                  borderRadius: 20,
                  shadowColor: 'rgba(27, 94, 142, 0.43)',
                  shadowBlur: 5,
                  color: '#3478A9',

                }
              },
              {
                value: 100 - percent,
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          },
          {
            name: '1',
            type: 'pie',
            z: 1,
            radius: radiusGroup[1],
            avoidLabelOverlap: false,
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              color: 'rgba(223, 234, 243, 0.7)'
            },
            data: [{ value: 1 }]
          },
          {
            name: '2',
            type: 'pie',
            z: 0,
            radius: radiusGroup[2],
            avoidLabelOverlap: false,
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              color: 'rgba(65, 129, 176, 0.2)'
            },
            data: [{ value: 1 }]
          }
        ]
      };
      return options
    }
  }
};
</script>