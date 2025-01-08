<template>
  <div class="tw-flex tw-items-center tw-text-xs tw-leading-[18px]">
    <span v-for="(item, index) in list"
          :key="index"
          :class="[
            index !== list.length - 1 ? 'tw-text-[#BFBFBF]' : 'tw-text-[#646464]',
            item.path ? 'tw-cursor-pointer hover:tw-text-[#86909C]' : 'tw-cursor-not-allowed',
          ]"
          @click="item.path && $router.push(item.path)"
    >{{(index !== 0 ? '/' : '') + item.name}}</span>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumbs',
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
};
</script>
