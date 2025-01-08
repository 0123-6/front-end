/*eslint-disable*/
export default {
  data() {
    return {
      title: '',
      isShowEmpty: false
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        if (this.chart) {
          this.chart.clear();
          this.setOptions(val);
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
      this.$emit('init');
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = this.$echarts.init(this.$el.querySelector('.ee-chart__inner'), null, { renderer: 'svg' });
      this.setOptions(this.chartData);
    }
  }
}
