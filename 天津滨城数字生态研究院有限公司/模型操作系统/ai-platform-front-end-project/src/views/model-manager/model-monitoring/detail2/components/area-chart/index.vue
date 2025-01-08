<template>
  <!--最外层-->
  <keep-alive>
    <div ref="chart" style="width: 100%;height: 100%;" />
  </keep-alive>
</template>

<script>
import _ from 'lodash';
import { getAreaChartConfig } from '@/views/model-manager/model-monitoring/detail2/components/area-chart/js';
import { windowAddReSizeEvent } from '@/utils';

export default {
  name: 'AreaChart',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.initEcharts();
  },
  methods: {
    initEcharts() {
      const chart = this.$echarts.init(this.$refs.chart);
      const chartOption = getAreaChartConfig(this.config);
      chart.setOption(chartOption);
      windowAddReSizeEvent(_.debounce(function(val) {
        chart.resize();
      }, 100));
    }
  }
};
</script>

<style scoped>

</style>
