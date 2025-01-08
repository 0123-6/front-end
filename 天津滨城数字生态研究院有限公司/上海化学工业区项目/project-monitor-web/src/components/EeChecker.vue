<template>
  <div v-show="value > 0 || alwaysShow" class="ee-checker ee-alert d-flex ai-center">
    <svg-icon icon-class="info-circle" width="16px" height="16px" />
    <div class="ee-alert__text flex-1 ell">
      <span class="f500">已选择 </span>
      <span class="f-primary f500">{{ value }}</span>
      <span class="f500"> 项数据</span>
    </div>
    <el-button v-if="value > 0" class="ml24" type="primary" link @click="$emit('cancel')">取消选择</el-button>
  </div>
</template>

<script>
export default {
  name: 'EeChecker',
  props: {
    value: {
      type: [Number, String],
      default: 0
    },
    alwaysShow: {
      type: Boolean,
      default: true
    }
  }
};
</script>
<style lang="scss">
.ee-checker {}

.ee-alert {
  padding: 12px 16px;
  background: rgba(2, 173, 236, 0.1);
  border-radius: 8px;

  .svg-icon {
    margin-right: 10px;
  }

  &__text {
    color: #555555;
    line-height: 22px;
  }

  .el-button--text {
    height: 22px;
  }
}
</style>