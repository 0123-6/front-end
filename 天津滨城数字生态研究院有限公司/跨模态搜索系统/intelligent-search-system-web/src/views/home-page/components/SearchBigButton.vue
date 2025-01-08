<template>
  <!--最外层-->
  <button class="flex justify-center items-center rounded-lg bg-white-button hover:bg-white-button-hover
  shadow-button-lg text-lg text-black active:bg-white-button-focus"
          @click.stop="goAdvancedSearch"
          :style="{width:width,height:height}">
    高级搜索
  </button>
</template>

<script>
export default {
  name: 'SearchBigButton',
  props: {
    width: {
      type: String,
      required: false,
      default: '158px'
    },
    height: {
      type: String,
      required: false,
      default: '70px'
    }
  },
  methods: {
    // 跳转到高级搜索页面
    goAdvancedSearch() {
      this.$emit('goAdvancedSearch');
      console.log('into goAdvancedSearch');
    }
  }
};
</script>

<style scoped>

</style>
