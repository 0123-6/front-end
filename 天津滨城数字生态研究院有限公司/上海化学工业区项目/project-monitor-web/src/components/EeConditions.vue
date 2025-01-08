<template>
  <div class="ee-conditions flex flex-wrap" :class="{ 'is-background': background }">
    <span class="ee-conditions__label f14">{{ label }}：</span>
    <el-tag v-for="n in data" :key="n.label" class="ell" type="info" closable @close="$emit('close', n.prop)">
      {{ n.label }}：
      <span class="f-primary" :title="n.text">{{ n.text }}</span>
    </el-tag>
    <el-tag v-if="data.length < 1" type="info">-</el-tag>
    <el-button v-if="showReset" class="ml12" type="primary" link @click="$emit('reset')">
      <el-icon>
        <RefreshLeft />
      </el-icon>清空
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'EeConditions',
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    label: {
      type: String,
      default: '高级筛选'
    },
    background: {
      type: Boolean,
      default: false
    },
    showReset: {
      type: Boolean,
      default: true
    }
  },
  methods: {

  }
};
</script>
<style lang="scss">
.ee-conditions {
  &__label {
    color: #595959;
    line-height: 24px;
  }

  .el-tag {
    margin-bottom: 8px;
    border-radius: 8px;

    &+.el-tag {
      margin-left: 8px;
    }

    &__content {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .el-button {
    height: 24px;
  }

  &.is-background {
    padding: 14px 24px 6px;
    background: rgba(2, 173, 236, .1);

    .el-tag {
      background: #fff;

      &__content {
        color: #555;
      }
    }
  }
}
</style>