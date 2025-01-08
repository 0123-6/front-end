<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-20 15:57:06
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 09:05:25
 * @FilePath: \ai-platform-front-end-project\src\components\TextWithLabel\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="textWrapper" class="text-wrapper">
    {{ text }}
  </div>
</template>

<script>
import Mark from 'mark.js';
export default {
  props: {
    labelContent: {
      type: String,
      required: true,
      default: ''
    },
    labelCallout: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      // text: this.labelContent,
      copyText: this.labelContent,
      color: 'green'
    };
  },
  computed: {
    text() {
      this.setMarkText();
      return this.labelContent;
    }
  },
  mounted() {
    // this.labelCallout.forEach(item => {
    //   this.text = this.replacePosition(this.text, item.value.start, item.value.end, `<span style="background: red;">${item.value.text}</span>`)
    // })
  },
  methods: {
    replacePosition(text, start, stop, replaceText) {
      return text.substring(0, stop - 1) + replaceText + text.substring(stop + 1);
    },
    setMarkText() {
      this.$nextTick(() => {
        const MarkObj = new Mark(document.getElementById('textWrapper'));
        this.labelCallout.map((item, index) => {
          MarkObj.markRanges([{
            start: item.value.start + 1,
            length: item.value.end - item.value.start
          }], { className: `marked-container${index}` });
          const classDom = document.getElementsByClassName(`marked-container${index}`);
          for (let classDomKey = 0; classDomKey < classDom.length; classDomKey++) {
            classDom[classDomKey].style.background = item.fillStyle;
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.text-wrapper{
  margin: 32px 50px;
  padding: 10px;
  background: rgba(128, 128, 128, 0.1);
  line-height: 2;
}
</style>
