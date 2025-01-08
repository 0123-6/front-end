<template>
  <!--最外层-->
  <div class="flex flex-direction">
    <!--上-->
    <div class="bgc-white box-shadow-1 border-radius-4" style="width: 100%;height: calc( (100% - 16px) / 2);">
      <div id="modelType" style="width: 100%;height: 100%;"></div>
    </div>
    <!--下-->
    <div class="margin-top-16 bgc-white box-shadow-1 border-radius-4" style="width: 100%;height: calc( (100% - 16px) / 2);">
      <div id="useScene" style="width: 100%;height: 100%;"></div>
    </div>
  </div>
</template>

<script>

import {getUseSceneEcharts} from "@/views/model-manager/model-monitoring/index/components/js/useScene";
import _ from "lodash";
import {getModelTypeEcharts} from "@/views/model-manager/model-monitoring/index/components/js/modelTypeEcharts";
import {windowAddReSizeEvent} from "@/utils";


export default {
  name: "TwoCircles",
  props:{
    modelTypeEcharts:{
      type:Object,
      required:true,
    },
    useSceneEcharts:{
      type:Object,
      required:true,
    },
  },
  mounted() {
    this.initEcharts()
  },
  methods:{
    initEcharts(){
      const ModelTypeEchart = this.$echarts.init(document.getElementById('modelType'));
      let modelTypeConfig = getModelTypeEcharts(this.modelTypeEcharts)
      ModelTypeEchart.setOption(modelTypeConfig);

      const UseSceneEchart = this.$echarts.init(document.getElementById('useScene'));
      let useSecneConfig = getUseSceneEcharts(this.useSceneEcharts)
      UseSceneEchart.setOption(useSecneConfig);

      windowAddReSizeEvent(_.debounce(function(val) {
        ModelTypeEchart.resize()
        UseSceneEchart.resize()
      }, 100))
    },
  },
}
</script>

<style scoped>

</style>
