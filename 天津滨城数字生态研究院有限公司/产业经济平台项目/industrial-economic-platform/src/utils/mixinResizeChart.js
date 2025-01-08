/* eslint-disable */

export default {
  data() {
    return {
      chartAmount: 30
    }
  },
  created() {
    if (this.manualResize === true) return
    this.debounceResizeChart = this.$debounce(this.resizeChart, 300);
  },
  activated() {
    if (this.manualResize === true) return
    if (this.resizeChartActivated) {
      // console.log('mixinResizeChart activated')
      this.$nextTick(() => {
        this.resizeChart();
      });
    }
    window.addEventListener('resize', this.debounceResizeChart);
    this.resizeChartActivated = true
  },
  deactivated() {
    if (this.manualResize === true) return
    window.removeEventListener('resize', this.debounceResizeChart);
  },
  methods: {
    resizeChart() {
      console.log(`resizeChart ${this.$vnode.tag}`)
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
