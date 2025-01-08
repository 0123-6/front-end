<template>
  <div class="flex flex-direction" style="background: linear-gradient(0deg, rgba(9, 29, 59, 0.93), rgba(9, 39, 72, 0.91));">
    <!-- 上 -->
    <div class="flex align-center"
         style="width: 499px;height: 40px;background: linear-gradient(90deg, #0A304E, rgba(21, 40, 71, 0.53));box-shadow: 0px 1px 0px 0px rgba(9, 70, 118, 0.74);">
      <div class="flex my-class-title"
           style="margin-left: 16px;width: 6px;height: 6px;background-color: #71B5FF;"></div>
      <div class="flex"
           style="margin-left: 4px;font-size: 16px;font-family: Source Han Sans SC;font-weight: 500;color: #9eb5cd;">
        生态环境
      </div>
    </div>
    <!-- 内容 -->
    <div class="flex flex-direction flex-1">
      <!-- 曲线图 -->
      <div class="flex" style="margin-top: 14px;width: 100%;">
        <div class="flex" id="chartEnronmentSumary" style="height: 200px;width: 100%;"></div>
      </div>
      <!-- 下面 -->
      <div class="flex flex-1 justify-around align-center" style="margin-top: 20px">
        <!-- 左边 -->
        <div class="flex flex-direction" style="width: 50%;height: 100%;">
          <!-- 上 -->
          <div class="flex align-center" style="margin-left: 18px;">
            <!-- 左 -->
            <div class="flex">
              <img src="/image/huanjing.png">
            </div>
            <!-- 右 -->
            <div class="flex flex-direction" style="margin-left: 16px;">
              <!-- 上 -->
              <div class="flex"
                   style="font-size: 20px;font-family: Source Han Sans SC;font-weight: 400;color: #9EB5CD;">
                2.3
              </div>
              <!-- 下 -->
              <div class="flex"
                   style="font-size: 14px;font-family: Source Han Sans SC;font-weight: 400;color: #9EB5CD;">
                空气质量指数
              </div>
            </div>
          </div>
          <!-- 下 -->
          <div class="flex" id="chartEnromentAirWeekChange" style="width: 100%;height: 194px"></div>
        </div>
        <!-- 右边 -->
        <div class="flex flex-direction" style="width: 50%;height: 100%;">
          <!-- 上 -->
          <div class="flex align-center" style="margin-left: 18px;">
            <!-- 左 -->
            <div class="flex">
              <img src="/image/shui.png">
            </div>
            <!-- 右 -->
            <div class="flex flex-direction" style="margin-left: 16px;">
              <!-- 上 -->
              <div class="flex"
                   style="font-size: 20px;font-family: Source Han Sans SC;font-weight: 400;color: #9EB5CD;">
                10
              </div>
              <!-- 下 -->
              <div class="flex"
                   style="font-size: 14px;font-family: Source Han Sans SC;font-weight: 400;color: #9EB5CD;">
                水质数据
              </div>
            </div>
          </div>
          <!-- 下 -->
          <div class="flex" id="chartEnromentWaterWeekChange" style="width: 100%;height: 194px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chartEnronmentSumaryConfig from '@/js/echarts/chartEnronmentSumary'
import chartEnromentAirWeekChangeConfig from '@/js/echarts/chartEnromentAirWeekChange'
import chartEnromentWaterWeekChangeConfig from '@/js/echarts/chartEnromentWaterWeekChange'
export default {
  name: "EcologicalEnvironment",
  mounted() {
    var chartEnronmentSumary = this.$echarts.init(document.getElementById('chartEnronmentSumary'));
    chartEnronmentSumary.setOption(chartEnronmentSumaryConfig);
    var chartEnromentAirWeekChange = this.$echarts.init(document.getElementById('chartEnromentAirWeekChange'));
    chartEnromentAirWeekChange.setOption(chartEnromentAirWeekChangeConfig);
    var chartEnromentWaterWeekChange = this.$echarts.init(document.getElementById('chartEnromentWaterWeekChange'));
    chartEnromentWaterWeekChange.setOption(chartEnromentWaterWeekChangeConfig);
  }
}
</script>

<style scoped>

</style>
