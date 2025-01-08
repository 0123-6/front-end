<template>
  <div class="tw-flex" :style="{height: height+'px'}">
    <div class="tw-w-[7px] tw-h-full tw-bg-[#6a95f8]"/>
    <div class="tw-w-[7px] tw-h-full tw-bg-[#2ed8fd]"/>
    <div class="tw-w-[7px] tw-h-full tw-bg-[#55f5ff]"/>
  </div>
</template>

<script>
export default {
  name: 'TitleImg',
  props: {
    height: {
      type: Number,
      default: 6,
      required: false,
    },
  },
};
</script>
