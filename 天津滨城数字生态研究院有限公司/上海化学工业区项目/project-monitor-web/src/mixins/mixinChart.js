/*eslint-disable*/
export default {
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    config() {
      return Object.assign({
        title: {},
        legend: {},
        grid: {},
        color: ['#02ADEC', '#E85050', '#FAB752', '#F28C53', '#68CD44', '#B7C1C5'],
        series: {}
      }, this.options)
    },
    showEmpty() {
      return Object.keys(this.data).length === 0
    }
  },
  watch: {
    data: {
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
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
  methods: {
    initChart() {
      this.chart = this.$echarts.init(this.$el.querySelector('.ee-chart__inner'), null, { renderer: 'svg' });
      this.setOptions(this.data);
    },
    setOptions(data) {
      if (Object.keys(data).length > 0) {
        this.chart.setOption(this.getOptions(data));
      }
    }
  }
}
