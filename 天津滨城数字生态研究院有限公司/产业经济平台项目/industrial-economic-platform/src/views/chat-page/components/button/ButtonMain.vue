<template>
  <button class="tw-flex tw-bg-white tw-justify-center tw-items-center tw-rounded-lg tw-text-sm tw-leading-[14px]"
          :class="[
            !disabled ? 'tw-bg-main tw-text-white hover:tw-cursor-pointer hover:tw-bg-main-hover active:tw-bg-main-focus' : 'tw-text-[#B7B7B7] tw-bg-[#E5E5E5] hover:tw-cursor-not-allowed',
          ]"
          :style="{boxShadow:(showShadow && !disabled) ? '0px 2px 4px 0px rgba(31,199,179,0.2)' : ''}"
          :disabled="disabled"
  >
    {{text ? text : null}}
    <!--插槽，展示传递进来的div-->
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'ButtonMain',
  props: {
    text: {
      // 类型为string或者vue组件
      type: [String, Object],
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    showShadow: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style scoped>

</style>
