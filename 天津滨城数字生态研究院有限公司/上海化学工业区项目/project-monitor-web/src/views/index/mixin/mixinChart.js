export default {
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
      window.addEventListener('resize', this.resizeHandler);
    });
  },
  // 组件销毁时，销毁图表，这是vue3的语法，请注意
  beforeUnmount() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    window.removeEventListener('resize', this.resizeHandler);
  },
  methods: {
    // 初始化图表
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = this.$echarts.init(this.$refs.outerDiv, null, {
        renderer: 'svg',
      });
      // 使用刚指定的配置项和数据显示图表。
      this.chart.setOption(this.chartOptions);
      // 点击图表，高亮显示，并在控制台打印信息
      this.chart.on('click', (params) => {
        console.log('click', params);
        this.handleClick(params.dataIndex);
      });
    },
    // 重新渲染图表
    renderChart() {
      this.chart.setOption(this.chartOptions);
    },
    // 定义一个window监听器，可以取消
    resizeHandler() {
      if (this.chart) {
        this.chart.resize();
      }
    },
  },
}
