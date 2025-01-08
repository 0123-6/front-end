<template>
  <!--最外层-->
  <keep-alive>
    <div ref="chart" style="width: 100%;height: 100%;"></div>
  </keep-alive>
</template>

<script>
import _ from "lodash";
import {windowAddReSizeEvent} from "@/utils";
import {getHistogramChartConfig} from "@/views/model-manager/model-monitoring/detail2/components/histogram-chart/js";

export default {
  name: "HistogramChart",
  props:{
    config:{
      type:Object,
      required:true,
    },
  },
  mounted() {
    this.initEcharts()
  },
  methods:{
    initEcharts(){
      const chart = this.$echarts.init(this.$refs.chart);
      let chartOption = getHistogramChartConfig(this.config)
      chart.setOption(chartOption);
      windowAddReSizeEvent(_.debounce(function(val) {
        chart.resize()
      }, 100))
    },
  },
}
</script>

<style scoped>

</style>
