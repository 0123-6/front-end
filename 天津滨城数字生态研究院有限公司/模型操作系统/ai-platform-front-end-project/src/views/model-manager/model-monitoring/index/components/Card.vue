<template>
  <div class="flex justify-between border-radius-4 bgc-white box-shadow-1" style="width: calc((100% - 32px) / 3);height: 100%;">
    <!--左-->
    <div class="flex flex-direction margin-left-24" style="height: 100%;">
      <div class="flex font-size-16 color-title margin-top-12">{{title}}</div>
      <div class="flex margin-top-8" style="color: #B7B7B7;padding: 2px 12px;background-color: #F7F7F7;border-radius: 9px;">24小时内</div>
      <div class="flex margin-top-8 font-weight" style="font-size: 36px;" :style="{color,}">{{number}}</div>
    </div>
    <!--右-->
    <div class="flex justify-center align-center" style="width: 18%;min-width: 100px;height: 106px;align-self: flex-end;margin-right: 15.16%;">
      <img :src="imgUrl" alt="" width="100%" height="100%" style="object-fit: fill;">
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props:{
    title:{
      type:String,
      required:true,
    },
    number:{
      type:Number,
      required: true,
    },
    color:{
      type:String,
      required:true,
    },
    imgUrl:{
      type:String,
      required:true,
    },
  },
}
</script>

<style scoped>

</style>
