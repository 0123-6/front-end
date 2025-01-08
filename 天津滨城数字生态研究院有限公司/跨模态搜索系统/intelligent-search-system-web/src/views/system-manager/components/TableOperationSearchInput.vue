<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-16 10:22:17
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-28 16:54:53
 * @FilePath: \intelligent-search-system-web\src\views\system-manager\components\TableOperationSearchInput.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="table-operation-search-input-container">
    <el-input
      class="search-input"
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      v-model="keyword"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown.native.enter="handleSearch">
      <el-button class="search-button" :class="{'focus': isFocus}" @click="handleSearch" slot="suffix">搜索</el-button>
    </el-input>
  </div>
</template>
<script>
export default {
  name: 'table-operation-search-input',
  props: {
    placeholder: {
      type: String,
      default: '请输入关键词'
    },
    searchWord: {
      type: String,
      default: '',
      required: true
    }
  },
  computed: {
    keyword: {
      get() {
        return this.searchWord;
      },
      set(newValue) {
        this.$emit('update:searchWord', newValue);
      }
    }
  },
  data() {
    return {
      isFocus: false
    };
  },
  methods: {
    handleSearch() {
      this.$emit('search', this.keyword);
    },
    handleFocus() {
      this.isFocus = true;
    },
    handleBlur() {
      this.isFocus = false;
    }
  }
};
</script>
<style lang="less" scoped>
@import '~@/styles/variables.less';
.table-operation-search-input-container {
  display: inline-block;
  .search-input {
    display: inline-block;
    width: 300px;
    ::v-deep {
      .el-input__inner {
        height: 40px;
        line-height: 40px;
        border-radius: 20px;
      }
    }
    .search-button {
      height: 32px;
      padding: 8px 12px !important;
      border-radius: 16px;
      background: #E9EEEF;
      color: @text-lighter;
      &.focus {
        background: @primary-color;
        color: #ffffff;

      }
    }
  }
}
</style>
