<!--一条蓝线 + 标题 组件-->
<template>
  <!--最外层-->
  <div class="flex justify-between align-center" :class="[notMarginBottom?'':'margin-bottom-16']">
    <!--左-->
    <div class="flex align-center">
      <div class="flex bgc-blue margin-right-8" style="width: 3px;" :style="[{'height':fontSize?fontSize+'px':'14px',}]" />
      <div class="flex color-title" :class="fontSize?'font-size-'+fontSize:'font-size-14'">
        {{ title }}
      </div>
    </div>
    <!--右-->
    <div class="flex align-center">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TitleStyle',
  props: {
    title: {
      type: String,
      required: true
    },
    notMarginBottom: {
      type: Boolean,
      required: false
    },
    fontSize: {
      type: Number,
      required: false
    }
  }
};
</script>

<style scoped>

</style>
