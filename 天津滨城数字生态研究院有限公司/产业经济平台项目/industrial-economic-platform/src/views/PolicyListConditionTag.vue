<template>
  <div class="d-flex ai-center flex-wrap flex-1">
    <slot></slot>
    <div v-if="form.regionCodeName" class="d-flex ai-center c-tag-item" style="padding-right: 10px">
      区域：
      <span class="value flex-1">{{ form.regionCodeName }}</span>
      <i class="el-icon-close" @click="handleRemove('regionCode')"></i>
    </div>
    <div v-if="form.orgIdName" class="d-flex ai-center c-tag-item">
      发布机构：
      <span class="value flex-1">{{ form.orgIdName }}</span>
      <i class="el-icon-close" @click="handleRemove('orgId')"></i>
    </div>
    <div v-if="form.industryTypeName" class="d-flex ai-center c-tag-item">
      产业类别：
      <span class="value flex-1">{{ form.industryTypeName }}</span>
      <i class="el-icon-close" @click="handleRemove('industryType')"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PolicyListConditionTag',
  components: {},
  props: {
    form: {
      type: Object,
      default() {
        return {};
      }
    },
    dicts: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    handleRemove(key) {
      this.$emit('remove', key);
    }
  }
};
</script>
<style lang='less'>
</style>
