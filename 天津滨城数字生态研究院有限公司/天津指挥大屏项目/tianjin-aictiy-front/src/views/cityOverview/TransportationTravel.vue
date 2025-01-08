<template>
  <div class="flex flex-direction" style="background: linear-gradient(0deg, rgba(9, 29, 59, 0.93), rgba(9, 39, 72, 0.91));">
    <!-- 上面 -->
    <div class="flex align-center"
         style="width: 499px;height: 40px;background: linear-gradient(90deg, #0A304E, rgba(21, 40, 71, 0.53));box-shadow: 0px 1px 0px 0px rgba(9, 70, 118, 0.74);">
      <div class="flex my-class-title"
           style="margin-left: 16px;width: 6px;height: 6px;background-color: #71B5FF;"></div>
      <div class="flex"
           style="margin-left: 4px;font-size: 16px;font-family: Source Han Sans SC;font-weight: 500;color: #9eb5cd;">
        交通出行
      </div>
    </div>
    <!-- 下面 -->
    <div class="flex flex-1 justify-around align-center">
      <!-- 今日交通指数 -->
      <div class="flex flex-direction justify-around align-center">
        <!-- 上 -->
        <div class="flex justify-center align-center today-num font-weight color-white"
             style="font-size: 24px;font-family: DIN;">
          <div class="flex" style="margin-bottom: 30px">
            20
          </div>
        </div>
        <!-- 下 -->
        <div class="flex"
             style="font-size: 14px;font-family: Source Han Sans SC;font-weight: 400;color: #9EB5CD;">
          今日交通指数
        </div>
      </div>
      <!-- 今日拥堵等级 -->
      <div class="flex flex-direction justify-around align-center">
        <!-- 上 -->
        <div class="flex justify-center align-center today-num font-weight color-white"
             style="font-size: 24px;font-family: DIN;">
          <div class="flex" style="margin-bottom: 30px">
            3.6
          </div>
        </div>
        <!-- 下 -->
        <div class="flex"
             style="font-size: 14px;font-family: Source Han Sans SC,serif;font-weight: 400;color: #9EB5CD;">
          今日拥堵等级
        </div>
      </div>
      <!-- 今日平均车速 -->
      <div class="flex flex-direction justify-around align-center">
        <!-- 上 -->
        <div class="flex justify-center align-center today-num font-weight color-white"
             style="font-size: 24px;font-family: DIN;">
          <div class="flex" style="margin-bottom: 30px">
            65
          </div>
        </div>
        <!-- 下 -->
        <div class="flex"
             style="font-size: 14px;font-family: Source Han Sans SC;font-weight: 400;color: #9EB5CD;">
          今日平均车速(km/h)
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TransportationTravel"
}
</script>

<style scoped>
.today-num {
  width: 115px;
  height: 74px;
  background-image: url(../../../public/image/dipan.png);
}
</style>
