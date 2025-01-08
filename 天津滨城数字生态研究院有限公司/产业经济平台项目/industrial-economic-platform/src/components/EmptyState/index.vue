<template>
  <div class="empty-state-container">
    <div>
      <img
        class="empty-icon"
        src="@/assets/icons/empty.svg"
        alt=""
      >
      <div class="empty-text"> {{ emptyTitle }} </div>
    </div>
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
@import '~@/styles/variables.less';
.empty-state-container {
  &:extend(.flex-center);
  color: #8c8c8c;
  .empty-icon {
    width: 10em;
    height: 10em;
  }
  .empty-text{
    margin-top: 16px;
    text-align: center;
    font-size: 13px;
  }
}
</style>
