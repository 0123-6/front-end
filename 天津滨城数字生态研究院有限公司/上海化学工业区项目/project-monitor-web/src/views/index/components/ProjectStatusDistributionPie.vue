<template>
  <!--最外层-->
  <div class="w-full h-full flex justify-center items-center text-sm">
    <!--左侧图表-->
    <div class="h-full" :class="[
      legendType === 1 ? 'w-[45%]' : 'w-[330px]',
    ]" ref="outerDiv" />
    <!--右侧图例1-->
    <div v-if="legendType === 1" class="w-[55%] h-full flex flex-col justify-center">
      <div v-for="(item, index) in chartData" :key="index" class="flex items-center" :class="[
        index !== 0 ? 'mt-[14px]' : '',
        legendClick ? 'cursor-pointer' : '',
      ]" @click="handleClick(index)">
        <!--小圆点-->
        <div class="w-[14px] min-w-[14px] h-[14px] flex justify-center items-center rounded-full"
          :style="{ backgroundColor: index === selectedIndex ? hexToRgba(colorList[index], 0.2) : null }">
          <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: colorList[index] }" />
        </div>
        <!--文字+提示-->
        <div class="ml-[7px] w-[80px] min-w-[80px] leading-[22px] select-none flex items-center"
          :style="{ color: index === selectedIndex ? colorList[index] : '#4B5666' }">
          <span>{{ item.name }}</span>
          <!--悬浮提示-->
          <el-tooltip placement="top" v-if="item?.prompt"
            popper-class="tooltip-max-w-199 tooltip-76 tooltip-x-14 tooltip-y-6">
            <template #content>
              <div class="w-full flex items-center">
                <span class="text-white text-xs leading-[22px]">{{ item.prompt }}</span>
              </div>
            </template>
            <img v-if="item?.prompt" src="@/views/index/icon/PromptSvg.svg" alt="" class="ml-1.5">
          </el-tooltip>
        </div>
        <!--分割线-->
        <div class="ml-1 w-[1px] min-w-[1px] h-[11px] bg-black-line" />
        <!--数值-->
        <span class="ml-[13px] w-[17px] min-w-[17px] ddin-n text-base select-none flex justify-end items-center"
          :style="{ color: index === selectedIndex ? colorList[index] : '#929DA3' }">{{ item.value }}</span>
        <span class="text-xs text-black-three">个</span>
        <!--百分比-->
        <span class="ml-6 w-10 min-w-10 ddin-n text-lg font-bold select-none flex justify-end items-center"
          :style="{ color: index === selectedIndex ? colorList[index] : '#1A262C' }">
          <!--					{{sumValue ? Number(item.value / sumValue * 100).toFixed(0) : 0}}%-->
          {{ Number(item.percent).toFixed(2) }}%
        </span>
      </div>
    </div>
    <!--右侧图例2-->
    <div v-if="legendType === 2" class="grid grid-cols-1 gap-x-5 gap-y-3.5" style="margin-left: 120px;">
      <div v-for="(item, index) in chartData" :key="index"
        class="w-[216px] h-[50px] rounded-lg border flex justify-between items-center px-4 bg-[#F9F9F9]" :class="[
          legendClick ? 'cursor-pointer hover:bg-[#FCFCFC]' : '',
        ]" :style="{
  backgroundColor: index === selectedIndex ? colorList[index].light : null,
  borderColor: index === selectedIndex ? colorList[index].text : '#F9F9F9',
  margin: '0 auto'
}" @click="handleClick(index)">
        <!--左-->
        <div class="flex items-center">
          <!--小圆点-->
          <div class="w-2 flex-shrink-0 h-2 rounded-full" :style="{ backgroundColor: colorList[index].text }"></div>
          <!--文字+提示-->
          <div class="ml-2.5 w-[84px] min-w-[84px] leading-[22px] select-none flex items-center text-black-two">
            <span>{{ item.name }}</span>
            <!--悬浮提示-->
            <el-tooltip placement="top" v-if="item?.prompt"
              popper-class="tooltip-max-w-199 tooltip-76 tooltip-x-14 tooltip-y-6">
              <template #content>
                <div class="w-full flex items-center">
                  <span class="text-white text-xs leading-[22px]">{{ item.prompt }}</span>
                </div>
              </template>
              <img v-if="item?.prompt" src="@/views/index/icon/PromptSvg.svg" alt="" class="ml-1.5">
            </el-tooltip>
          </div>
        </div>
        <!--右，数值+个-->
        <div class="flex items-center">
          <span class="text-black ddin-n text-lg font-bold leading-5">{{ item.value }}</span>
          <span class="ml-1 text-black-two text-sm leading-[22px]">个</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixinChart from "@/views/index/mixin/mixinChart";
import { hexToRgba } from "@/utils/index";

export default {
  name: "ProjectStatusDistributionPie",
  mixins: [mixinChart],
  props: {
    // 图表数据
    chartData: {
      type: Array,
      required: true,
    },
    colorList: {
      type: Array,
      required: true,
    },
    top: {
      type: Number,
      default: 88,
    },
    title: {
      type: String,
      required: true,
    },
    showInnerLabel: {
      type: Boolean,
      default: true,
    },
    radius: {
      type: Array,
      default: () => ['75%', '100%'],
    },
    roseType: {
      type: String,
      default: null,
    },
    borderWidth: {
      type: Number,
      default: 4,
    },
    // 图例是否可点击
    legendClick: {
      type: Boolean,
      default: true,
    },
    // 1正常图例，2项目态势图例
    legendType: {
      type: Number,
      required: false,
      default: 1,
    },
    innerLabelType: {
      type: String,
      default: "1"
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // 选中的图例
      selectedIndex: null,
      autoResize: false
    };
  },
  computed: {
    sumValue() {
      let sum = 0;
      for (let i = 0; i < this.chartData.length; i++) {
        sum += this.chartData[i].value;
      }
      return sum;
    },
  },
  watch: {
    chartData: {
      handler() {
        this.getChartOptions()
        this.renderChart();
      },
      deep: true,
    },
  },
  created() {
    this.getChartOptions()
  },
  activated() {
    // console.log('ProjectStatusDistributionPie activated')
    this.$nextTick(() => {
      this.resizeHandler()
    })
  },
  methods: {
    getChartOptions() {
      console.log('getChartOptions', this.chartData)
      const options = {
        // 调色盘
        color: this.colorList.map(item => {
          if (typeof item === 'string') {
            return item;
          } else {
            return item.text;
          }
        }),
        // 悬浮效果
        tooltip: {
          trigger: 'item',
          appendToBody: true,
        },
        // 图例组件
        legend: {
          show: false,
          top: this.top,
          right: 0,
          orient: 'vertical',
          itemGap: 14,
          padding: 0,
          itemWidth: 8,
          itemHeight: 8,
          icon: 'circle',
          // 格式化
          formatter: (name) => {
            let sum = 0;
            for (let i = 0; i < this.chartData.length; i++) {
              sum += this.chartData[i].value;
            }
            const index = this.chartData.findIndex((item) => item.name === name);
            const item = this.chartData[index];
            return (
              `{name|${item.name}}` +
              `{split|}` +
              `{value|${item.value}}` +
              `{percent|${Number((item.value / sum) * 100).toFixed(0)}%}`
            );
          },
          // 图例组件文本样式
          textStyle: {
            height: 22,
            rich: {
              name: {
                color: '#4B5666',
                fontFamily: 'PingFang SC',
                fontSize: 14,
                lineHeight: 22,
                height: 22,
                width: 66,
                padding: [0, 0, 0, 4],
                align: 'left',
              },
              split: {
                width: 1,
                height: 10,
                backgroundColor: '#DBE1E9'
              },
              value: {
                padding: [0, 0, 0, 15],
                width: 14,
                fontSize: 16,
                height: 22,
                align: 'right',
                fontFamily: 'D-DIN',
                color: '#929DA3',
              },
              percent: {
                padding: [0, 0, 0, 29],
                fontSize: 18,
                align: 'left',
                height: 22,
                fontFamily: 'D-DIN',
                color: '#1A262C',
                fontWeight: 700,
              }
            }
          }
        },
        // 数据项
        series: [
          {
            // 类型为饼图
            type: 'pie',
            roseType: this.roseType,
            name: this.title,
            // 饼图图形上的文本标签
            label: {
              show: this.showInnerLabel,
              position: 'center',
              formatter: this.title,
              fontSize: 16,
              color: '#929DA3',
              fontFamily: 'PingFang SC'
            },
            width: 150,
            height: 150,
            top: this.legendType == 1 ? 80 : 'center',
            left: 'center',
            // 饼图内环和外环范围
            radius: this.radius,
            // 拼图每一块的样式
            itemStyle: {
              borderRadius: 0,
              borderColor: '#fff',
              borderWidth: this.borderWidth,
            },
            // 悬浮效果
            emphasis: {
              disabled: false,
              scale: true
            },
            data: this.chartData,
          }
        ]
      }
      if (this.innerLabelType == 2) {
        options.series[0].width = '100%'
        options.series[0].height = '100%'
        options.series[0].radius = ['40%', '56%']
        options.series[0].label = {
          alignTo: 'edge',
          formatter: this.total == 0 ? '{percent|0%}\n{name|{b}}' : '{percent|{d}%}\n{name|{b}}',
          minMargin: 5,
          edgeDistance: 20,
          lineHeight: 24,
          rich: {
            percent: {
              fontSize: 18,
              color: 'inherit',
              fontFamily: 'D-DIN'
            },
            name: {
              fontSize: 14,
            }
          }
        }
        options.series[0].labelLayout = (params) => {
          const isLeft = params.labelRect.x < this.chart.getWidth() / 2;
          const points = params.labelLinePoints;
          // Update the end point.
          if (points) {
            points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width;
          }
          return {
            labelLinePoints: points || []
          };
        }
        options.series[0].avoidLabelOverlap = true
        options.series.push({
          type: 'pie',
          roseType: this.roseType,
          label: {
            show: true,
            position: 'center',
            formatter: `{value|${this.total}}{unit|个}\n\n{name|全部项目}`,
            rich: {
              name: {
                fontSize: 16,
                fontFamily: 'PingFang SC',
                color: '#4B5666'
              },
              unit: {
                fontSize: 14,
                fontFamily: 'PingFang SC',
                color: '#4B5666'
              },
              value: {
                fontSize: 28,
                fontFamily: 'D-DIN',
                color: '#4B5666'
              }
            }
          },
          width: '100%',
          height: '100%',
          radius: ['40%', '56%'],
          top: this.legendType == 1 ? 80 : 'center',
          left: this.legendType == 1 ? 6 : 'center',
          itemStyle: {
            borderRadius: 0,
            borderColor: '#fff',
            borderWidth: this.borderWidth,
          },
          data: this.chartData,
        })
      }
      this.chartOptions = options
    },
    // 取消选中
    downplay() {
      this.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: this.selectedIndex,
      });
    },
    init() {
      this.downplay();
      this.selectedIndex = null;
    },
    handleClick(index) {
      if (!this.legendClick) {
        return;
      }
      this.downplay();
      if (this.selectedIndex === index) {
        this.selectedIndex = null;
        this.$emit('change', null);
      } else {
        this.chart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: index,
        });
        this.selectedIndex = index;
        this.$emit('change', this.chartData[index].name);
      }
    },
    hexToRgba,
  },
};
</script>

<style></style>
