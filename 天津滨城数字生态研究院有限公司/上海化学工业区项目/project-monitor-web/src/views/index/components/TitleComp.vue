<template>
  <!--最外层-->
  <div class="flex items-center">
    <!--一级标题-->
    <div v-if="type === 1" class="flex items-center">
      <img src="@/assets/icons/svg/double-round.svg" alt="" style="width: 26px;height: 26px;">
      <span class="ml-2.5 text-[22px] font-medium leading-[22px]" :style="{ color: this.color }">{{ title }}</span>
    </div>
    <!--二级标题-->
    <div v-if="type === 2" class="flex items-center">
      <img src="@/assets/icons/svg/four-corner-star.svg" alt="" style="width: 12px;height: 12px;">
      <span class="ml-1.5 text-base font-medium leading-[22px]" :style="{ color: this.color }">{{ title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TitleComp',
  props: {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      default: 1,// 1为2个圆圈，2个星星
    },
    color: {
      type: String,
      default: '#1A262C',
    }
  },
};
</script>

<style scoped></style>
