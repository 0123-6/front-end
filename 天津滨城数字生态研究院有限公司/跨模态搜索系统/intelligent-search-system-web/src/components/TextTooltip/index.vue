<template>
  <el-tooltip
    v-model="showTooltip"
    placement="top"
    :open-delay="100"
    effect="dark"
    :disabled="!showTooltip"
    :popper-class="'table-tool-container'"
  >
    <div slot="content">{{ text }}</div>
    <div class="text-container" @mouseenter="showTips($event, text)">{{ text }}</div>
  </el-tooltip>
</template>

<script>
export default {
  name: 'TextTooltip',
  data() {
    return {
      showTooltip: false
    };
  },
  props: {
    text: {
      type: String,
      required: true,
      default: ''
    }
  },
  methods: {
    // 文本悬浮显示
    showTips(obj, innerItem) {
      // obj为鼠标移入时的事件对象
      // currentWidth 为文本在页面中所占的宽度，创建标签，加入到页面，获取currentWidth ,最后在移除
      const TemporaryTag = document.createElement('span');
      TemporaryTag.innerText = innerItem;
      TemporaryTag.className = 'getTextWidth';
      document.querySelector('body').appendChild(TemporaryTag);
      const currentWidth = document.querySelector('.getTextWidth').offsetWidth;
      document.querySelector('.getTextWidth').remove();

      // cellWidth为表格容器的宽度
      const cellWidth = obj.target.offsetWidth;

      // 当文本宽度小于||等于容器宽度两倍时，代表文本显示未超过两行
      // currentWidth <= (2 * cellWidth) ? this.showTooltip = false : this.showTooltip = true;
      this.showTooltip = currentWidth > (2 * cellWidth);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/styles/variables.less";
.text-container {
  .ellipsis-muti-line(2);
}
</style>
