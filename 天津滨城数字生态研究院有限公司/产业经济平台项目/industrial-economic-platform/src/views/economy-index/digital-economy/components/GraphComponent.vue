<template>
  <div :id="id2" class=""/>
</template>

<script>
import { debounce } from 'lodash';

export default {
  name: 'GraphComponent',
  props: {
    id2: {
      type: String,
      required: true,
    },
    nodes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      myChart: null,
      option: {
        backgroundColor: 'white',
        animation: false,
        animationDuration: 0,
        series: {
          width: null,
          height: null,
          center: ['50%', '50%'],
          left: 0,
          top: 0,
          type: 'graph',
          layout: 'force',
          animation: false,
          force: {
            initLayout: 'none',
            gravity: null,
            repulsion: [10, 20],
            edgeLength: [50, 130],
            layoutAnimation: true,
            friction: 0.6,
          },
          roam: false,
          zoom: 1,
          draggable: false,
          lineStyle: {
            color: '#E5E6EB',
            width: 1,
            opacity: 1
          },
        },
        tooltip: {
          show: true,
          formatter: (params) => `${params.data.name}：${params.data.value}`,
        },
      },
      styleList: [
        {
          symbolSize: 130,
          label: {
            show: true,
            color: '#1A262C',
            fontSize: 14,
            fontWeight: 500,
            width: 130,
            overflow: 'breakAll',
          },
          itemStyle: {
            color: 'rgba(92,130,223,0.52)',
          },
        },
        {
          symbolSize: 120,
          label: {
            show: true,
            color: '#1A262C',
            fontSize: 14,
            fontWeight: 500,
            width: 120,
            overflow: 'breakAll',
          },
          itemStyle: {
            color: 'rgba(232,169,97,0.9)',
          }
        },
        {
          symbolSize: 110,
          label: {
            show: true,
            color: '#1A262C',
            fontSize: 14,
            fontWeight: 500,
            width: 110,
            overflow: 'breakAll',
          },
          itemStyle: {
            color: 'rgba(137,126,220,0.8)',
          }
        },
        {
          symbolSize: 100,
          label: {
            show: true,
            color: '#1A262C',
            fontSize: 14,
            fontWeight: 500,
            width: 100,
            overflow: 'breakAll',
          },
          itemStyle: {
            color: 'rgba(111,204,187,0.7)',
          }
        },
        {
          symbolSize: 90,
          label: {
            show: true,
            color: '#1A262C',
            fontSize: 14,
            fontWeight: 500,
            width: 90,
            overflow: 'breakAll',
          },
          itemStyle: {
            color: 'rgba(111,204,187,0.6)',
          }
        },
        {
          symbolSize: 90,
          label: {
            show: true,
            color: '#1A262C',
            fontSize: 14,
            fontWeight: 500,
            width: 90,
            overflow: 'breakAll',
          },
          itemStyle: {
            color: 'rgba(232,169,97,0.6)',
          }
        },
        {
          symbolSize: 80,
          label: {
            show: true,
            color: '#1A262C',
            fontSize: 14,
            fontWeight: 500,
            width: 80,
            overflow: 'breakAll',
          },
          itemStyle: {
            color: 'rgba(239,143,106,0.5)',
          }
        },
        {
          symbolSize: 73,
          label: {
            show: true,
            color: '#1A262C',
            fontSize: 14,
            fontWeight: 500,
            width: 73,
            overflow: 'breakAll',
          },
          itemStyle: {
            color: 'rgba(154,182,251,0.5)',
          },
        },
      ],
    };
  },
  watch: {
    nodes: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  mounted() {
    this.debounceResizeChart = debounce(this.resizeChart, 500);
    window.addEventListener('resize', this.debounceResizeChart);
    this.init();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.debounceResizeChart);
  },
  methods: {
    init() {
      console.log('into graph component');
      const chartDom = document.getElementById(this.id2);
      this.myChart = this.$echarts.init(chartDom);
      // this.myChart.on('mousedown', (params) => {
      //   // 将nodes设置为fixed为false
      //   // eslint-disable-next-line no-shadow
      //   const option = this.myChart.getOption();
      //   option.series[0].force.layoutAnimation = true;
      //   const { nodes } = option.series[0];
      //   nodes.forEach((item) => {
      //     // eslint-disable-next-line no-param-reassign
      //     item.fixed = false;
      //   });
      //   console.log('params: ', params);
      //   option.series[0].nodes[params.dataIndex].x = params.event.offsetX;
      //   option.series[0].nodes[params.dataIndex].y = params.event.offsetY;
      //   option.series[0].nodes[params.dataIndex].fixed = true;
      //   this.myChart.setOption(option);
      // });
      // this.myChart.on('mouseup', (params) => {
      //   // 将nodes设置为fixed为false
      //   // eslint-disable-next-line no-shadow
      //   const option = this.myChart.getOption();
      //   option.series[0].force.layoutAnimation = true;
      //   const { nodes } = option.series[0];
      //   nodes.forEach((item) => {
      //     // eslint-disable-next-line no-param-reassign
      //     item.fixed = false;
      //   });
      //   console.log('params: ', params);
      //   option.series[0].nodes[params.dataIndex].x = params.event.offsetX;
      //   option.series[0].nodes[params.dataIndex].y = params.event.offsetY;
      //   option.series[0].nodes[params.dataIndex].fixed = true;
      //   this.myChart.setOption(option);
      // });
      this.option.series.width = document.getElementById(this.id2).offsetWidth;
      this.option.series.height = document.getElementById(this.id2).offsetHeight;
      this.option.series.zoom = 1;
      this.option.series.force.layoutAnimation = false;
      const newNodeList = this.getData();
      this.option.series.nodes = JSON.parse(JSON.stringify(newNodeList));
      this.option.series.edges = [];

      this.option.series.nodes[0].x = this.option.series.width / 2;
      this.option.series.nodes[0].y = this.option.series.height / 2;
      this.option.series.nodes[0].fixed = true;
      // 放大和缩小的中心点为一级菜单，即第一个节点
      // this.option.series.center = [this.option.series.nodes[0].x, this.option.series.nodes[0].y];
      // 获取屏幕宽度
      const screenWidth = document.body.clientWidth;
      this.option.series.force.gravity = 0.01;
      if (screenWidth > 1900) {
        this.option.series.force.gravity = 0.01;
      } else if (screenWidth > 1600) {
        this.option.series.force.gravity = 0.0125;
      } else if (screenWidth > 1300) {
        this.option.series.force.gravity = 0.0150;
      } else {
        this.option.series.force.gravity = 0.0225;
      }

      // if (this.option.series.nodes.length <= 20) {
      //   this.option.series.force.gravity = 0.01;
      // } else {
      //   this.option.series.force.gravity = this.option.series.nodes.length / 350;
      // }
      this.myChart.setOption(JSON.parse(JSON.stringify(this.option)), true);
      this.adjustment();
    },
    getData() {
      // 获取屏幕宽度
      const screenWidth = document.body.clientWidth;
      let maxWidth = 130;
      if (screenWidth > 1900) {
        maxWidth = 130;
      } else if (screenWidth > 1600) {
        maxWidth = 115;
      } else if (screenWidth > 1300) {
        maxWidth = 105;
      } else {
        maxWidth = 90;
      }
      const newNodeList = [...this.nodes];
      // 将nodes根据value值进行排序
      newNodeList.sort((a, b) => b.value - a.value);
      // 遍历nodes，设置对应的option
      for (let i = 0; i < newNodeList.length; i += 1) {
        newNodeList[i] = {
          ...newNodeList[i],
          ...this.styleList[Math.min(i, this.styleList.length - 1)],
          symbolSize: maxWidth - 10 * Math.min(i, 4),
          label: {
            ...(this.styleList[Math.min(i, this.styleList.length - 1)].label),
            width: maxWidth - 10 * Math.min(i, 4),
          },
        };
      }
      console.log('newNodeList: ', newNodeList);
      return newNodeList;
    },
    // 调整图表大小
    resizeChart() {
      // this.myChart.resize();
      this.init();
    },
    async adjustment() {
      for (let i = 0; i < 20; i += 1) {
        setTimeout(() => {
          // console.log(this.id2, '准备第', i, '次重绘');
          this.myChart.resize();
        }, 0);
      }
    },
  },
};
</script>

<style scoped>

</style>
