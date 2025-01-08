<template>
  <div class="empty-state-container">
    <img
      class="empty-icon"
      src="@/assets/no-data.svg"
      alt=""
    >
    <div class="margin-top-16"> {{ emptyTitle }} </div>
  </div>
</template>
<script>
export default {
  name: 'EmptyState',
  props: {
    emptyTitle: {
      type: String,
      default: '暂无数据'
    }
  }
};
</script>
<style lang="less" scoped>
.empty-state-container {
  text-align: center;
  margin-top: 10vh;
  color: #8c8c8c;
  .empty-icon {
    margin: 20px auto;
    width: 10em;
    height: 10em;
  }
}
</style>
