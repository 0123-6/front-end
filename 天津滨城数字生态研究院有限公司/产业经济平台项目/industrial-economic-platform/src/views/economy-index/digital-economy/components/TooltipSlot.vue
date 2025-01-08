<template>
  <!--最外层-->
  <div class="tw-w-full tw-flex tw-flex-col">
    <span class="tw-mt-[10px] tw-ml-[17px] tw-font-medium tw-text-sm tw-leading-[20px] tw-text-[#5B5858] tw-tracking-[-0.6px]">说明</span>
    <div class="tw-mt-[6px] tw-h-[1px] tw-bg-[#F4F4F4]"/>
    <span class="tw-mt-[9px] tw-ml-[22px] tw-w-[258px] tw-text-sm tw-text-[#86909C] tw-leading-[23px] tw-tracking-[-0.6px]">{{content}}</span>
  </div>
</template>

<script>
export default {
  name: 'TooltipSlot',
  props: {
    // 提示内容
    content: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>

</style>
