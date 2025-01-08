<template>
  <!-- <div :class="className + ' map-chart-container'" :style="{ height: height, width: width }" /> -->
  <div class="ee-chart ee-chart--map" :class="{ 'is-empty': isShowEmpty }" :style="{ height: height, width: width }">
    <div class="ee-chart__inner" :style="{ height: height, width: width }" />
    <div class="ee-chart__empty">暂无数据</div>
  </div>
</template>

<script>
/* eslint-disable */

import axios from 'axios';
import { analysisApis } from '@/api/structural-analysis';

const zoomMin = 0.4;
const zoomMax = 3;
const zoomStep = 0.4;

export default {
  name: 'line-chart',
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
      default: '550px'
    },
    // 父组件传递过来的图表数据
    chartData: {
      type: Object,
      required: true
    },
    showBack: {
      type: Boolean,
      default: true
    },
    tooltip: {
      type: Object,
      default() {
        return {
          show: false
        };
      }
    },
    toolbox: {
      type: Object,
      default() {
        return {};
      }
    },
    visualMap: {
      type: Object,
      default() {
        return {};
      }
    },
    minLevel: {
      type: Number,
      default: 4
    },
    pieceColors: {
      type: Array,
      default() {
        return ['#E3ECF6', '#D5E2FC', '#A6DFFC', '#7BB0F7', '#7798F3', '#608AFE', '#4F7CF7', '#517CF0'];
      }
    },
    visualDivisor: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      realMax: 0,
      isShowEmpty: false
    };
  },
  watch: {
    /* 如果图表数据是后台获取的，监听父组件中的数据变化，重新触发Echarts */
    chartData: {
      deep: true,
      handler(val) {
        const { historyList } = this;
        if (val.code && (historyList.length === 0 || historyList[historyList.length - 1].code !== val.code)) {
          this.historyList.push({
            code: val.code,
            name: val.name
          });
        }
        this.chart.clear();
        val.data?.forEach((item) => (item.value = item.value === 0 ? NaN : item.value));
        if (val.code === 'china') {
          this.setOptions(this.$china, val.code, val.name);
        } else {
          this.loadMap(val.code);
        }
      }
    }
  },
  created() {
    this.chart = null;
    this.historyList = [];
    this.allAreaCode = [];
  },
  mounted() {
    this.zoom = 1;
    this.getAllRegionsData();
    /* 图表初始化 */
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    /* 释放图表实例 */
    this.chart.dispose();
    /* dispose 会释放内部占用的一些资源和事件绑定，但是解除实例的引用我们是做不到的，所以需要重新赋值为null */
    this.chart = null;
  },
  methods: {
    roundUpToNearest(n, nearest) {
      return Math.ceil(n / nearest) * nearest;
    },
    getAllRegionsData() {
      analysisApis
        .getAllRegions()
        .then((result) => {
          this.allAreaCode = result.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    initChart() {
      this.chart = this.$echarts.init(this.$el.querySelector('.ee-chart__inner'), null, { renderer: 'svg' });
      // 加载效果
      this.chart.showLoading();
      // 单击下钻
      this.chart.on('click', (params) => {
        if (this.loading) {
          return this.$message({
            type: 'warning',
            message: '请误频繁点击'
          });
        }
        const currentRegion = this.allAreaCode.find((item) => item.regionName.indexOf(params.name) > -1);
        if (currentRegion) {
          const areaCode = currentRegion.regionCode;
          if (areaCode === this.curMapName) return;
          // 台湾、香港、澳门不可下钻
          if (['710000', '810000', '820000'].indexOf(areaCode) > -1) return;
          const level = this.$getLevelByCode(areaCode);
          if (level + 1 <= this.minLevel) {
            this.loadMap(areaCode);
            this.historyList.push({
              code: areaCode,
              name: params.name,
              level
            });
            const result = [];
            const obj = {};
            for (let i = 0; i < this.historyList.length; i++) {
              if (!obj[this.historyList[i].code]) {
                result.push(this.historyList[i]);
                obj[this.historyList[i].code] = true;
              }
            }
            this.historyList = result;
            this.$emit('changeAreaCode', this.historyList);
            this.$emit('level-change', this.historyList[this.historyList.length - 1]);
          }
        }
      });
      this.chart.on('mouseover', (params) => {
        this.$emit('mouseover', params);
      });
      this.chart.on('mouseout', () => {
        this.$emit('mouseout', {});
      });
      this.historyList.push({
        code: this.chartData.code,
        name: this.chartData.name
      });
      if (this.chartData.code === 'china') {
        this.setOptions(this.$china, this.chartData.code, this.chartData.name);
      } else {
        this.loadMap(this.chartData.code);
      }
    },
    setOptions(mapData, mapName) {
      // 注册地图
      this.$echarts.registerMap(mapName, mapData);
      this.curMapName = mapName;
      const self = this;
      const feature = {};
      if (this.showBack && this.minLevel > 1) {
        feature.myBack = {
          show: true,
          title: '返回上一级',
          icon: `image://${location.origin}/resource/img/rollback.svg`,
          emphasis: {
            iconStyle: {
              textFill: '#356DF6'
            }
          },
          onclick: () => {
            if (self.historyList.length === 1) {
              self.$message({
                type: 'warning',
                message: '已经到达最上一级地图了'
              });
            } else {
              // 移除最后一个
              self.historyList.pop();
              const areaCode = self.historyList[self.historyList.length - 1].code;
              if (areaCode === 'china') {
                self.setOptions(this.$china, 'china', '中国');
                this.zoom = 1;
              } else {
                self.loadMap(areaCode);
              }
              this.$emit('changeAreaCode', self.historyList);
              this.$emit('level-change', this.historyList[this.historyList.length - 1]);
            }
          }
        };
      }
      feature.myZoomIn = {
        show: true,
        // title: '放大',
        icon: `image://${location.origin}/resource/img/zoomIn.svg`,
        onclick: () => {
          const zoom = Math.min(zoomMax, this.zoom + zoomStep);
          if (zoom !== this.zoom) {
            this.zoom = zoom;
            this.chart.setOption(
              {
                series: [{ zoom: this.zoom }]
              },
              false
            );
          }
        }
      };
      feature.myZoomOut = {
        show: true,
        // title: '缩小',
        icon: `image://${location.origin}/resource/img/zoomOut.svg`,
        onclick: () => {
          const zoom = Math.max(zoomMin, this.zoom - zoomStep);
          if (zoom !== this.zoom) {
            this.zoom = zoom;
            this.chart.setOption(
              {
                series: [{ zoom: this.zoom }]
              },
              false
            );
          }
        }
      };
      const { visualDivisor } = this;
      const { pieceNum = 8, min, max, data } = this.chartData;
      let pieces = [];
      if (data.length > 0) {
        const base = Math.pow(10, Math.max(parseInt(Math.abs(max)).toString().length - (pieceNum === 8 ? 2 : 2), 1));
        let realMax = Math.ceil(max / (pieceNum * base)) * (pieceNum * base);
        let realMin = min === 0 ? 0 : parseInt(min / (pieceNum * base)) * (pieceNum * base);
        const step = (realMax - realMin) / pieceNum;
        pieces = [
          { gte: realMin, lte: realMin + step, label: `${realMin / visualDivisor}-${(realMin + step) / visualDivisor}`, color: this.pieceColors[0] }
        ];
        for (let index = 1; index < pieceNum - 1; index++) {
          const gte = realMin + step * index;
          const lte = realMin + step * (index + 1);
          pieces.push({ gte, lte, label: `${gte / visualDivisor}-${lte / visualDivisor}`, color: this.pieceColors[index] });
        }
        pieces.push({
          gte: realMax - step,
          lte: realMax,
          label: `${(realMax - step) / visualDivisor}-${realMax / visualDivisor}`,
          color: this.pieceColors[pieceNum - 1]
        });
      }
      const options = {
        tooltip: this.tooltip,
        toolbox: {
          show: true,
          itemSize: 20,
          feature,
          x: 30,
          ...this.toolbox
        },
        visualMap: {
          left: 20,
          bottom: 24,
          text: ['高', '低'], // 文本
          calculable: false,
          showLabel: true,
          itemWidth: 20,
          itemHeight: 5,
          itemGap: 6,
          pieces,
          textStyle: {
            color: '#86909C'
          },
          ...this.visualMap
        },
        series: [
          {
            name: 'map',
            type: 'map', // 地图
            map: mapName, // 加载注册的地图
            selectedMode: false, // 不让单独选中
            roam: 'move', // 开始鼠标事件，scale缩放、move移动
            // 图形上的文本标签
            label: {
              show: true,
              color: '#485E97',
              fontWeight: 500
            },
            // 地图样式
            itemStyle: {
              borderColor: 'rgba(104, 152, 190, 1)', // 边框样式
              areaColor: '#ffffff'
            },
            emphasis: {
              itemStyle: {
                areaColor: 'rgba(53, 109, 246, 0.72)'
              },
              label: {
                show: true,
                color: '#23335C',
                fontWeight: 500
              }
            },
            data: self.chartData.data
          }
        ]
      };
      console.log('map options', options);
      this.chart.setOption(options, true);
      // 隐藏loading
      this.chart.hideLoading();
    },
    loadMap(code) {
      if (code.trim() === '') return;
      this.loading = true;
      axios
        .get(`https://geo.datav.aliyun.com/areas_v3/bound/${code}${code.substr(4, 2) === '00' ? '_full' : ''}.json`)
        .then((data) => {
          this.isShowEmpty = false;
          this.zoom = 1;
          this.setOptions(data.data, code);
          this.loading = false;
        })
        .catch((e) => {
          axios
            .get(`https://geo.datav.aliyun.com/areas_v3/bound/${code}.json`)
            .then((res) => {
              this.zoom = 1;
              this.setOptions(res.data, code);
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        });
    }
  }
};
</script>
