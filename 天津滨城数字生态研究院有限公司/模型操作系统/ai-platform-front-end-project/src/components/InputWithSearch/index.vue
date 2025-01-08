<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-01 14:55:02
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-08-16 14:29:24
 * @FilePath: \ai-platform-front-end-project\src\components\InputWithSearch\other.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="input-with-search-container">
    <el-input
      v-model="searchWord"
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      class="input-with-search-detail"
      :class="{'focus': isFocus}"
      clearable
      @keydown.enter.native="searchData"
      @focus="showFocusState"
      @blur="hiddenFocusState"
    >
      <el-button slot="append" @click="searchData">{{ buttonName }}</el-button>
    </el-input>
  </div>
</template>
<script>
import _debounce from 'lodash/debounce';
export default {
  props: {
    placeholder: {
      type: String,
      default: '请输入关键词'
    },
    buttonName: {
      type: String,
      default: '搜索'
    }
  },
  data() {
    return {
      searchWord: '',
      isFocus: false
    };
  },
  methods: {
    // 点击按钮
    searchData: _debounce(function() {
      this.$emit('search', this.searchWord);
    }, 300),
    // 聚焦
    showFocusState() {
      this.isFocus = true;
      this.$emit('focus', this.searchWord);
    },
    // 失焦
    hiddenFocusState() {
      this.isFocus = false;
      this.$emit('blur', this.searchWord);
    }
  }
};
</script>
<style lang="scss" scoped>
.input-with-search-container {
  width: 240px;
  ::v-deep {
    .input-with-search-detail {
      border-radius: 17px;
      border: 1px solid #E9EEEF;
      .el-input__inner {
        border-radius: 16px 0 0 16px;
        height: 32px !important;
        line-height: 32px !important;
        border: none
      }
      .el-input__prefix {
        height: 32px;
        .el-input__icon {
          line-height: 32px;
        }
      }
      .el-input__suffix {
        height: 32px;
        .el-input__icon {
          line-height: 32px;
        }
      }
      .el-input-group__append {
        border-radius: 0 16px 16px 0;
        background: #E9EEEF;
        color: #646464;
        border: none;
        .el-button {
          padding: 9px 16px;
          border: none;
        }
      }
      &:hover {
        border-color: #0164FF;
        .el-input__inner {
          border-right:1px solid #0164FF;
        }
        .el-input-group__append {
          background: #E4EDF8 ;
          color: #0164FF;
        }
      }
      &.focus {
        border-color: #0164FF;
        .el-input__inner {
          border-right:1px solid #0164FF;
        }
        .el-input-group__append {
          background: #E4EDF8 ;
          color: #0164FF;
        }

      }
    }
  }
}
</style>
