<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-06-13 15:40:55
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-08-04 17:05:57
 * @FilePath: \ai-platform-front-end-project\src\components\EmptyState\other.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="empty-state-container">
    <svg-icon class-name="empty-icon" icon-class="empty" />
    <div class="margin-top-16"> {{ emptyTitle }} </div>
  </div>
</template>
<script>
export default {
  props: {
    emptyTitle: {
      type: String,
      default: '暂无数据'
    }
  }
};
</script>
<style lang="scss" scoped>
.empty-state-container {
  text-align: center;
  margin-top: 10vh;
  color: #8c8c8c;
  .empty-icon {
    width: 10em !important;
    height: 10em !important;
  }
}
</style>
