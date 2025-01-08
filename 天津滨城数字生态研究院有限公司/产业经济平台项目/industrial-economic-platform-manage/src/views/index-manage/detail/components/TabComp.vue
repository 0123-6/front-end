<template>
  <!--最外层-->
  <div class="tw-flex tw-items-center">
    <div v-for="(item, index) in list"
         :key="index"
         @click="changeItem(item)"
         class="tw-mr-[33px] tw-flex tw-flex-col tw-cursor-pointer">
      <span class="tw-text-sm tw-leading-[20px] tw-font-medium"
            :class="[item === selectedItem ? 'tw-text-[#356DF6]' : 'tw-text-[#86909C]']">{{item}}</span>
      <div class="tw-mt-[7px] tw-h-[2px]"
           :class="[item === selectedItem ? 'tw-bg-main' : 'tw-bg-white']"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabComp',
  props: {
    list: {
      type: Array,
      required: true,
    },
    selectedItem: {
      type: String,
      required: true,
    },
  },
  methods: {
    changeItem(item) {
      this.$emit('changeItem', item);
    },
  },
};
</script>

<style scoped>

</style>
