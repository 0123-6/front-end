<template>
  <!--最外层-->
  <div :key="displayedText">
    <Viewer :initialValue="displayedText"/>
  </div>
</template>

<script>
import { Viewer } from '@toast-ui/vue-editor';

export default {
  name: 'ViewerTimeout',
  props: {
    content: {
      type: String,
      required: true,
    },
    justShow: {
      type: Boolean,
      required: false,
      default: true,
    },
    stopGenerate: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: {
    Viewer,
  },
  data() {
    return {
      displayedText: '',
      currentIndex: 0,
      timer: null,
    };
  },
  watch: {
    stopGenerate: {
      handler() {
        console.log('into ViewerTimeout stopGenerate watch');
        if (this.stopGenerate) {
          clearInterval(this.timer);
          this.timer = null;
        }
      },
      deep: true,
    },
  },
  created() {
    if (this.justShow) {
      this.displayedText = this.content;
    } else {
      this.timer = setInterval(() => {
        if (this.stopGenerate || this.currentIndex >= this.content.length) {
          clearInterval(this.timer);
          this.timer = null;
          console.log('显示完毕，content： ', this.content);
          this.$emit('on-ok');
        } else if (this.currentIndex < this.content.length) {
          this.displayedText += this.content[this.currentIndex];
          this.currentIndex += 1;
          // 自动将屏幕滚动到底部
          if (this.content !== '很高兴您喜欢这个答案' && this.content !== '感谢您的提醒') {
            // 先渲染，再滚动
            this.$nextTick(() => {
              console.log('ViewerTimeout this.$nextTick');
              const div = document.getElementById('layoutRef');
              div.scrollTo(0, div.scrollHeight);
            });
          }
        }
      }, 50);
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  methods: {

  },
};
</script>

<style lang="less" scoped>

</style>
