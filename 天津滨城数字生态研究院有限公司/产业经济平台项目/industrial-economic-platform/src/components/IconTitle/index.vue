<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IconTitle',
  props: {
    iconColor: {
      type: String,
      default: '#0D7CDB'
    },
    title: {
      type: String,
      required: true
    }
  }
});
</script>

<template>
  <div class="title-container">
      <div :style="{background: iconColor}"></div>
      <div class="title">{{title}}</div>
  </div>
</template>

<style scoped lang="less">
.title-container {
  display: flex;
  align-items: center;
  padding: 16px 0;
  >div:first-child {
    width: 2px;
    height: 16px;
    margin-right: 8px;
  }
  .title {
    color: #1A262C;
    font-size: 16px;
    font-family: PingFang SC;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
  }
}
</style>
