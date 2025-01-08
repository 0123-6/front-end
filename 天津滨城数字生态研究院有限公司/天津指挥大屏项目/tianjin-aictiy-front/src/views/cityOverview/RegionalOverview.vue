<template>
  <div class="flex flex-direction"
       style="background: linear-gradient(0deg, rgba(9, 29, 59, 0.93), rgba(9, 39, 72, 0.91));">
    <!-- 上 -->
    <div class="flex align-center"
         style="width: 499px;height: 40px;background: linear-gradient(90deg, #0A304E, rgba(21, 40, 71, 0.53));box-shadow: 0px 1px 0px 0px rgba(9, 70, 118, 0.74);">
      <div class="flex my-class-title"
           style="margin-left: 16px;width: 6px;height: 6px;background-color: #71B5FF;"></div>
      <div class="flex"
           style="margin-left: 4px;font-size: 16px;font-weight: 500;color: #9eb5cd;">
        区域概览
      </div>
    </div>
    <!-- 中 -->
    <div class="flex flex-direction flex-1 justify-around" style="">
      <!-- 上 人口 面积 -->
      <div class="flex">
        <!-- 人口 -->
        <div class="flex align-center" style="width: 50%;">
          <!-- 左边图标 -->
          <div class="flex margin-left-16">
            <img src="/image/renkou.png">
          </div>
          <!-- 右边 -->
          <div class="flex flex-direction justify-between " style="margin-left: 13px;">
            <div style="font-size: 18px;font-family: Adobe Heiti Std;" class="color-white">
              人口：20000/万人
            </div>
            <div style="font-size: 13px;font-weight: 400;color: #9EB5CD;">
              统计时间 2022/2/23 16:30:30
            </div>
          </div>
        </div>
        <!-- 面积 -->
        <div class="flex align-center" style="width: 50%;">
          <!-- 左边图标 -->
          <div class="flex margin-left-16">
            <img src="/image/mianji.png">
          </div>
          <!-- 右边 -->
          <div class="flex flex-direction justify-between " style="margin-left: 13px;">
            <div style="font-size: 18px;font-family: Adobe Heiti Std;" class="color-white">
              面积:150.58/平方公里
            </div>
            <div style="font-size: 13px;font-weight: 400;color: #9EB5CD;">
              统计时间 2022/2/23 16:30:30
            </div>
          </div>
        </div>
      </div>
      <!-- 下 企业 GDP -->
      <div class="flex">
        <!-- 企业 -->
        <div class="flex align-center" style="width: 50%;">
          <!-- 左边图标 -->
          <div class="flex margin-left-16">
            <img src="/image/qiye.png">
          </div>
          <!-- 右边 -->
          <div class="flex flex-direction justify-between " style="margin-left: 13px;">
            <div style="font-size: 18px;font-family: Adobe Heiti Std;" class="color-white">
              企业:2000/家
            </div>
            <div style="font-size: 13px;font-weight: 400;color: #9EB5CD;">
              统计时间 2022/2/23 16:30:30
            </div>
          </div>
        </div>
        <!-- GDP -->
        <div class="flex align-center" style="width: 50%;">
          <!-- 左边图标 -->
          <div class="flex margin-left-16">
            <img src="/image/GDP.png">
          </div>
          <!-- 右边 -->
          <div class="flex flex-direction justify-between" style="margin-left: 13px;">
            <div style="font-size: 18px;font-family: Adobe Heiti Std;" class="color-white">
              GDP:600/亿元
            </div>
            <div style="font-size: 13px;font-weight: 400;color: #9EB5CD;">
              统计时间 2022/2/23 16:30:30
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegionalOverview",//区域概览
}
</script>

<style scoped>

</style>
