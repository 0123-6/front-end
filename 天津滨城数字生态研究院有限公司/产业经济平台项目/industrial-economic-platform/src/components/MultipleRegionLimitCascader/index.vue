<template>
  <div class="multiple-region-cascader">
    <el-input class="out-input" :class="{'isFocus': isFocus}"
              v-model="nameStr" :suffix-icon="isFocus?'el-icon-arrow-up':'el-icon-arrow-down'" readonly></el-input>
    <el-cascader
        :ref="refStr"
        :options="regionOptions"
        :props="defaultProps"
        collapse-tags
        :show-all-levels="false"
        @change="handleChange"
        @visible-change="changeOutInputStyle"
        v-bind="$attrs"
        v-on="$listeners">
    </el-cascader>
  </div>
</template>

<script>

export default {
  name: 'region-cascader',
  props: {
    regionOptions: {
      type: Array
    }
  },
  data() {
    return {
      refStr: '',
      defaultProps: {
        children: 'children',
        multiple: true
      },
      isFocus: false,
      pathList: [],
      nameList: [],
      nameStr: ''
    };
  },
  mounted() {
    this.refStr = `multipleRegionCascader${new Date().getTime()}`;
    this.$nextTick(() => {
      this.handleChange();
    });
  },
  methods: {
    handleChange() {
      let checkedNodeList = this.$refs[this.refStr].getCheckedNodes();
      checkedNodeList = checkedNodeList.filter((item) => !(item.parent && item.parent.checked)); // 核心
      this.pathList = checkedNodeList.map((item) => item.path);
      this.nameList = checkedNodeList.map((item) => item.label);
      this.nameStr = checkedNodeList.map((item) => item.label).join(',');
      // 如果只查全选的父级，可以通过这两个方法
      this.$emit('getCurrentLabel', this.nameList);
      this.$emit('getCurrentKey', this.pathList);
      this.$emit('getCurrentNode', checkedNodeList);
      // 正常操作通过v-model 和 change 方法即可
    },
    changeOutInputStyle(isShow) {
      if (isShow) {
        this.isFocus = true;
      } else {
        this.isFocus = false;
      }
    }
  }
};

</script>
<style lang="less">
@import '~@/styles/variables.less';
.multiple-region-cascader {
  width: 200px;
  position: relative;
  .out-input {
    width: 100%;
    position: absolute;
    &.isFocus {
      .el-input__inner {
        border-color: @primary-color;
      }
    }
  }

  .el-cascader {
    opacity: 0;
    width: 100%;
  }
}
</style>
