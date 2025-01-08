<template>
  <!--最外层-->
  <button class="flex justify-center items-center rounded-md shadow-button bg-blue text-base text-white font-semibold
  hover:bg-blue-hover active:bg-blue-focus"
          :style="{width:width,height:height}"
          @click.stop="search" @keydown="keydown">
    搜索
  </button>
</template>

<script>
export default {
  name: 'SearchButton',
  props: {
    // 按钮尺寸,small,小号;medium,中号;
    size: {
      type: String,
      required: false,
      default: 'medium'
    }
  },
  data() {
    return {
      // 按钮宽度
      width: '0px',
      // 按钮高度
      height: '0px'
    };
  },
  created() {
    if (this.size === 'medium') {
      this.width = '80px';
      this.height = '40px';
    } else if (this.size === 'small') {
      this.width = '64px';
      this.height = '32px';
    }
  },
  methods: {
    search() {
      this.$emit('search');
    },
    keydown(e) {
      console.info('高级搜索获取了键盘事件');
    }
  }
};
</script>
