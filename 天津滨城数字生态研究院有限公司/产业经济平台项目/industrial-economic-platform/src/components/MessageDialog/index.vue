<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-11 17:41:30
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-07-18 15:37:06
 * @FilePath: \company-template\src\views\system-manager\components\MessageDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    v-dialogDrag
    :title="title"
    visible
    :show-close="isShowCloseButton"
    :width="width+'px'"
    :close-on-click-modal="false"
    :custom-class="`message-dialog ${customClass}`"
    :before-close="cancelOperation"
  >
    <slot name="content" />
    <span v-if="isShowFooter" slot="footer" class="dialog-footer">
      <el-button class="cancel" @click="cancelOperation">{{ cancelBtnTitle }}</el-button>
      <el-button class="primary" @click="saveOperation">{{ saveBtnTitle }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'message-dialog',
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
      default: '确定'
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
    cancelOperation() {
      this.$emit('cancel');
    },
    // 确定按钮
    saveOperation() {
      this.$emit('save');
    }
  }
};
</script>
<style lang="less" scoped>
::v-deep .el-dialog__body {
  padding-top: 48px;
  padding-bottom: 48px;
  text-align: center;
}
</style>
