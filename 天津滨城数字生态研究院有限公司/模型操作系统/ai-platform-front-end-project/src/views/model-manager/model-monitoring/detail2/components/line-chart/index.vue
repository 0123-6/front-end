<template>
  <!--最外层-->
  <keep-alive>
    <div ref="chart" style="width: 100%;height: 100%;"></div>
  </keep-alive>
</template>

<script>
import _ from "lodash";
import {getLineChartConfig} from "@/views/model-manager/model-monitoring/detail2/components/line-chart/js";
import {windowAddReSizeEvent} from "@/utils";

export default {
  name: "LineChart",
  props:{
    config:{
      type:Object,
      required:true,
    },
    num:{
      type:Number,
      required: true,
    },
  },
  created() {
    this.config.num = this.num
  },
  mounted() {
    this.initEcharts()
  },
  methods:{
    initEcharts(){
      const chart = this.$echarts.init(this.$refs.chart);
      let chartOption = getLineChartConfig(this.config)
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
