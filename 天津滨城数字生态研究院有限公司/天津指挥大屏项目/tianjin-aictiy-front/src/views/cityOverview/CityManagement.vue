<template>
  <div class="flex flex-direction" style="background: linear-gradient(0deg, rgba(9, 29, 59, 0.93), rgba(9, 39, 72, 0.91));">
    <!-- 上 -->
    <div class="flex align-center"
         style="width: 499px;height: 40px;background: linear-gradient(90deg, #0A304E, rgba(21, 40, 71, 0.53));box-shadow: 0px 1px 0px 0px rgba(9, 70, 118, 0.74);">
      <div class="flex my-class-title"
           style="margin-left: 16px;width: 6px;height: 6px;background-color: #71B5FF;"></div>
      <div class="flex"
           style="margin-left: 4px;font-size: 16px;font-family: Source Han Sans SC;font-weight: 500;color: #9eb5cd;">
        城市管理
      </div>
    </div>
    <!-- 内容 -->
    <div class="flex flex-1 justify-around align-center" style="">
      <!-- 左边 -->
      <div class="flex" style="width: 50%;height: 100%;">
        <div class="flex" id="chartCityTrustSum" style="width: 100%;height: 100%;"></div>
      </div>
      <!-- 右边 -->
      <div class="flex" style="width: 50%;height: 100%;">
        <div class="flex" id="chartAirSumChange" style="width: 100%;height: 100%;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import chartCityTrustSumConfig from '@/js/echarts/chartCityTrustSum'
import chartAirSumChangeConfig from '@/js/echarts/chartAirSumChange'
export default {
  name: "CityManagement",
  mounted() {
    var chartCityTrustSum = this.$echarts.init(document.getElementById('chartCityTrustSum'));
    chartCityTrustSum.setOption(chartCityTrustSumConfig);
    var chartAirSumChange = this.$echarts.init(document.getElementById('chartAirSumChange'));
    chartAirSumChange.setOption(chartAirSumChangeConfig);
  },
}
</script>

<style scoped>

</style>