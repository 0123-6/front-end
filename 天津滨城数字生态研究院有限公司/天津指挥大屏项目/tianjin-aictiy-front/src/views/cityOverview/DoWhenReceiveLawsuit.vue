<template>
  <div class="flex flex-direction"
       style="background: linear-gradient(0deg, rgba(9, 29, 59, 0.93), rgba(9, 39, 72, 0.91));">
    <!-- 上 -->
    <div class="flex align-center"
         style="width: 499px;height: 40px;background: linear-gradient(90deg, #0A304E, rgba(21, 40, 71, 0.53));box-shadow: 0px 1px 0px 0px rgba(9, 70, 118, 0.74);">
      <div class="flex my-class-title"
           style="margin-left: 16px;width: 6px;height: 6px;background-color: #71B5FF;"></div>
      <div class="flex"
           style="margin-left: 4px;font-size: 16px;font-family: Source Han Sans SC;font-weight: 500;color: #9eb5cd;">
        12345接诉即办
      </div>
    </div>
    <!-- 内容 -->
    <div class="flex flex-direction flex-1">
      <!-- 129 99 -->
      <div class="flex justify-around align-center" style="margin-top: 42px;">
        <!-- 129 -->
        <div class="flex align-center">
          <!-- 左 -->
          <div class="flex">
            <img src="/image/即办.png">
          </div>
          <!-- 右 -->
          <div class="flex flex-direction justify-around" style="margin-left: 8px">
            <!-- 数量 -->
            <div style="font-size: 18px;font-family: Adobe Heiti Std;font-weight: normal" class="color-white">
              129件
            </div>
            <!-- 固定文字 -->
            <div style="font-size: 13px;font-family: Source Han Sans SC;font-weight: 400;color: #9EB5CD;">
              今日接诉即办数量
            </div>
            <!-- 变动文字 -->
            <div class="flex"
                 style="font-size: 13px;font-family: Source Han Sans SC;font-weight: 400;color: #9EB5CD;">
              <div>对比昨日: 20件</div>
              <div>
                <Icon type="md-arrow-round-up" color="#13D8A4"/>
              </div>
            </div>
          </div>
        </div>
        <!-- 99 -->
        <div class="flex align-center">
          <!-- 左 -->
          <div class="flex">
            <img src="/image/即办受理.png">
          </div>
          <!-- 右 -->
          <div class="flex flex-direction justify-around" style="margin-left: 8px">
            <!-- 数量 -->
            <div style="font-size: 18px;font-family: Adobe Heiti Std;font-weight: normal;" class="color-white">
              99件
            </div>
            <!-- 固定文字 -->
            <div style="font-size: 13px;font-family: Source Han Sans SC;font-weight: 400;color: #9EB5CD;">
              今日受理数量
            </div>
            <!-- 变动文字 -->
            <div class="flex"
                 style="font-size: 13px;font-family: Source Han Sans SC;font-weight: 400;color: #9EB5CD;">
              <div>对比昨日: 20件</div>
              <div>
                <Icon type="md-arrow-round-down" color="#F9FD8A"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 曲线图 -->
      <div class="flex" style="margin-top: 14px;width: 100%;">
        <div class="flex" id="chart2" style="height: 170px;width: 100%;"></div>
      </div>
      <!-- 下面 -->
      <div class="flex flex-1 justify-around align-center" style="">
        <!-- 左边 -->
        <div class="flex flex-direction" style="width: 50%;height: 100%;">
          <div class="flex" id="weiFaTable" style="width: 100%;height: 100%;"></div>
        </div>
        <!-- 右边 -->
        <div class="flex flex-direction" style="width: 50%;height: 100%;">
          <div class="flex" id="numSort" style="width: 100%;height: 100%;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chart2Config from '@/js/echarts/chart2'
import weiFaTableConfig from '@/js/echarts/weiFaTable'
import numSortConfig from '@/js/echarts/numSort'

export default {
  name: "DoWhenReceiveLawsuit",
  mounted() {

    var myChart2 = this.$echarts.init(document.getElementById('chart2'));
    myChart2.setOption(chart2Config);

    var myChart = this.$echarts.init(document.getElementById('weiFaTable'));
    myChart.setOption(weiFaTableConfig);

    var myChartNumSort = this.$echarts.init(document.getElementById('numSort'));
    myChartNumSort.setOption(numSortConfig);

  },
}
</script>

<style scoped>

</style>
