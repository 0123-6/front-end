<template>
  <!--最外层-->
  <div :id="id" class="tw-w-full tw-h-full" v-loading="loading"></div>
</template>

<script>
/* eslint-disable */
import { debounce } from 'lodash';
import axios from "axios";

export default {
  name: 'Gis-Map',
  props: {
    id: {
      type: String,
      required: true
    },
    mapValue: {
      type: Array,
      default: () => []
    },
    option: {
      type: Object,
      default: () => ({})
    },
    mapType: {
      type: [String, Number],
      default: 'china',
      required: false
    }
  },
  data() {
    return {
      chart: null,
      showAdcode: null,
      showName: null,
      // 加载中
      loading: false,
    };
  },
  beforeMount() {},
  mounted() {
    this.debounceResizeChart = debounce(this.resizeChart, 500);
    window.addEventListener('resize', this.debounceResizeChart);
    this.initMap();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.debounceResizeChart);
  },
  watch: {
    showAdcode(value, oldValue) {
      console.log('value: ', value);
      console.log('oldValue: ', oldValue);
      this.$emit('changeValue', value);
    },
    showName(value, oldValue) {
      console.log('value: ', value);
      console.log('oldValue: ', oldValue);
      this.$emit('changeName', value);
    },
    mapValue(value, oldValue) {
      console.log('value: ', value);
      console.log('oldValue: ', oldValue);
      // this.renderMap(
      //   {
      //     series: [
      //       {
      //         data: value,
      //       }
      //     ]
      //   },
      //   false
      // );
      this.initMap();
    },
    mapType(type, oldType) {
      // this.renderMap(
      //   {
      //     series: [
      //       {
      //         map: type,
      //         aspectScale: type === 'chinaAllCity' ? 1.02 : 0.75,
      //       }
      //     ]
      //   },
      //   false
      // );
      this.initMap();
    },
    option: {
      handler(option) {
        console.log('option: ', option);
        this.renderMap(option, false);
      },
      deep: true
    }
  },
  methods: {
    resizeChart() {
      this.chart.resize();
    },
    initMap() {
      console.log('into initMap');
      // 如果this.mapValue为undefined,null,或者空数组,则不渲染地图
      if (!this.mapValue || this.mapValue.length === 0) {
        console.log('this.mapValue为空,不渲染地图');
        return;
      }
      // 基于准备好的dom，初始化echarts实例
      this.chart = this.$echarts.init(document.getElementById(this.id));
      this.$echarts.registerMap('china', this.$china);
      // 添加悬浮进入事件
      this.chart.on('mouseover', (params) => {
        console.log('params: ', params);
        // if (params.data) {
        //   this.showAdcode = params.data.adcode;
        // }
        this.showName = params.name;
      });
      const newOption = {
        ...this.option,
        series: [
          {
            ...this.option.series[0],
            map: this.mapType+'',
            aspectScale: this.mapType === 'chinaAllCity' ? 1.02 : 0.75,
            data: this.mapValue,
          }
        ]
      }
      this.loading = true;
      this.renderMap(newOption, true);
    },
    renderMap(options, notMerge) {
      // 如果是市级全国地图，或者市级省地图，需要先判断是否已经注册过
      if (this.mapType !== 'china') {
        if (this.mapType === 'chinaAllCity') {
          // 如果是市级全国地图
          // 如果没有注册过市级全国地图，需要先注册
          if (!window.chinaAllCityRegist) {
            fetch(location.origin + '/resource/json/chinaAllCity.json')
              .then((res) => {
                return res.json();
              })
              .then((res2) => {
                this.$echarts.registerMap('chinaAllCity', res2);
                window.chinaAllCityRegist = true;
                this.setOption({...options}, notMerge);
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            this.setOption({...options}, notMerge);
          }
        } else {
          // 如果是市级省地图
          // 如果window.registerMapList
          if (!window.registerMapList) {
            window.registerMapList = [];
          }
          // 如果没有注册过市级省地图，需要先注册,通过window.registerMapList来判断,registerMapList是一个数组,里面存放已经注册过的地图adcode
          if (!window.registerMapList.includes(this.mapType+'')) {
            axios
              .get(`https://geo.datav.aliyun.com/areas_v3/bound/${this.mapType}_full.json`)
              .then((res) => {
                this.$echarts.registerMap(this.mapType+'', res.data);
                window.registerMapList.push(this.mapType+'');
                this.setOption({...options}, notMerge);
              })
              .catch(() => {
                axios
                  .get(`https://geo.datav.aliyun.com/areas_v3/bound/${this.mapType}.json`)
                  .then((res) => {
                    this.$echarts.registerMap(this.mapType+'', res.data);
                    window.registerMapList.push(this.mapType+'');
                    this.setOption({...options}, notMerge);
                  })
                  .catch(() => {});
              });
          } else {
            this.setOption({...options}, notMerge);
          }
        }
      } else {
        this.setOption({...options}, notMerge);
      }
    },
    setOption(option, notMerge) {
      this.chart.setOption(option, notMerge);
      this.loading = false;
    },
  }
};
</script>
