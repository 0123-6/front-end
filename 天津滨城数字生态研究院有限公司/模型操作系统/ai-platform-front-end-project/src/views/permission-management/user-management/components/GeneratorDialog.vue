<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-04 16:06:12
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 12:39:05
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\dataSet\components\MessageDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    v-dialogDrag
    append-to-body
    :top="top+'vh'"
    :title="title"
    :width="width+'px'"
    visible
    :close-on-click-modal="false"
    :custom-class="'message-dialog'"
    :before-close="cancelCreate"
  >
    <slot name="content" />
    <span slot="footer" class="dialog-footer">
      <el-button class="white-btn" :disabled="!canCancelButton" @click="cancelCreate">{{ cancelBtnTitle }}</el-button>
      <el-button class="blue-btn" :disabled="!canOkButton" @click="saveCreate">{{ saveBtnTitle }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '提示'
    },
    width: {
      type: Number,
      default: 480
    },
    cancelBtnTitle: {
      type: String,
      default: '取消'
    },
    saveBtnTitle: {
      type: String,
      default: '确认'
    },
    top: {
      type: Number,
      required: false,
      default: 30
    },
    canOkButton: {
      type: Boolean,
      required: false,
      default: true
    },
    canCancelButton: {
      type: Boolean,
      required: false,
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
    saveCreate() {
      this.$emit('ok');
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep {
  label{
    font-weight: 400;
  }
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
      //padding: 24px 72px;
      padding: 0;
      text-align: center;
    }
    .el-dialog__footer {
      padding: 24px;
      padding-top: 0;
    }
  }
}
</style>
