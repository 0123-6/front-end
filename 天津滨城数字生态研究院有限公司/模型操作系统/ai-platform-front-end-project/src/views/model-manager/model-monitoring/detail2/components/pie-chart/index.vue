<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-04-19 10:42:16
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-04-19 10:42:33
 * @FilePath: \ai-platform-front-end-project\src\views\model-manager\model-monitoring\detail2\components\pie-chart\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!--最外层-->
  <keep-alive>
    <div ref="chart" style="width: 100%;height: 100%;" />
  </keep-alive>
</template>

<script>
import _ from 'lodash';
import { getPieChartConfig } from '@/views/model-manager/model-monitoring/detail2/components/pie-chart/js';
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
      const chartOption = getPieChartConfig(this.config);
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
