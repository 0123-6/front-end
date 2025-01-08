/* eslint-disable */

export default {
  data() {
    return {
      chartAmount: 0
    }
  },
  mounted() {
    this.debounceResizeChart = this.$debounce(this.resizeChart, 200);
    window.addEventListener('resize', this.debounceResizeChart);
  },
  activated() {
    // console.log('mixinResizeChart activated')
    if (this.resizeChartActivated) {
      this.$nextTick(() => {
        this.resizeChart();
      });
    }
    this.resizeChartActivated = true
  },
  unmounted() {
    // console.log('mixinResizeChart unmounted')
    window.removeEventListener('resize', this.debounceResizeChart);
  },
  methods: {
    resizeChart() {
      console.log(`resizeChart ${this.$.type.name}`)
      const { $refs, chartAmount } = this
      for (let i = 0; i <= chartAmount; i++) {
        if ($refs[`chart${i}`]) {
          // console.log(`chart${i}`, $refs[`chart${i}`])
          if (Array.isArray($refs[`chart${i}`])) {
            $refs[`chart${i}`].forEach(element => {
              element.chart && element.chart.resize();
            });
          } else {
            $refs[`chart${i}`].chart && $refs[`chart${i}`].chart.resize();
          }
        }
      }
      this.customResize && this.customResize()
    },
  }
};
