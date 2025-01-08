<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-04 16:06:12
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-10-09 16:17:29
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\dataSet\components\MessageDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    v-dialogDrag
    top="30vh"
    :title="title"
    visible
    :show-close="isShowCloseButton"
    :width="width+'px'"
    :close-on-click-modal="false"
    :custom-class="`message-dialog ${customClass}`"
    :before-close="cancelCreate"
  >
    <slot name="content" />
    <span v-if="isShowFooter" slot="footer" class="dialog-footer">
      <el-button class="white-btn" @click="cancelCreate">{{ cancelBtnTitle }}</el-button>
      <el-button class="blue-btn" @click="saveCreate">{{ saveBtnTitle }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import _debounce from 'lodash/debounce';
export default {
  props: {
    title: {
      type: String,
      default: '提示'
    },
    width: {
      type: Number,
      default: 400
    },
    cancelBtnTitle: {
      type: String,
      default: '取消'
    },
    saveBtnTitle: {
      type: String,
      default: '确认'
    },
    isShowFooter: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: ''
    },
    isShowCloseButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
    };
  },
  methods: {
    // 取消按钮
    cancelCreate() {
      this.$emit('cancel');
    },
    // 确定按钮
    saveCreate: _debounce(function() {
      this.$emit('save');
    }, 300)
  }
};
</script>
<style lang="scss" scoped>
::v-deep {
  .message-dialog {
    border-radius: 4px;
    .el-dialog__header {
      height: 40px;
      line-height: 40px;
      padding: 0 24px;
      border-bottom: 1px solid rgba(242,242,242,1);
      .el-dialog__title {
        font-family: SourceHanSansSC-Bold;
        font-size: 14px;
        color: #262626;
        letter-spacing: 0;
        line-height: 16px;
        font-weight: 700;
      }
    }
    .el-dialog__body {
      padding: 24px 72px;
      text-align: center;
      line-height: 21px;
    }
    .el-dialog__footer {
      padding: 24px;
      padding-top: 0;
    }
  }
}
</style>
