<template>
  <div class="tw-flex tw-flex-col" :class="[innerClass]">
    <!--标题-->
    <div class="tw-flex tw-items-center">
      <TitleImg :height="14"/>
      <span class="tw-ml-[11px] tw-text-[24px] tw-leading-[24px] tw-font-medium tw-text-[#1A262C] tw-tracking-[-1.03px]">{{title}}</span>
    </div>
    <!--内容-->
    <span class="tw-mt-[18px] tw-w-[420px] tw-text-[#333333] tw-text-base tw-leading-[32px] tw-tracking-[-0.69px]">{{content}}</span>
  </div>
</template>

<script>
import TitleImg from './TitleImg.vue';

export default {
  name: 'InnerContent',
  components: {
    TitleImg,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mt: {
      type: String,
      default: '0',
    },
    innerClass: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped>

</style>
