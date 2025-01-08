<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-27 17:01:14
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 15:15:38
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\components\audit-dialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    v-dialogDrag
    visible
    title="提示"
    width="480px"
    :close-on-click-modal="false"
    append-to-body
    :before-close="cancel"
  >
    <div class="flex flex-direction align-center" style="width: 100%;">
      <div class="flex font-size-14 color-content margin-left-20">
        确定符合要求请通过，不符合要求请驳回。
      </div>
      <div class="margin-top-16">
        <el-form :inline="true" label-suffix=":">
          <el-form-item label="审核意见" label-width="100">
            <el-input
              v-model="textarea"
              style="width: 300px"
              type="textarea"
              :rows="6"
              placeholder="请填写审核意见"
            />
          </el-form-item>
        </el-form>
        <div style="margin-left: 66px;color: #B7B7B7;font-size: 12px;">选填</div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="white-btn" @click="reject">驳 回</el-button>
      <el-button class="blue-btn" @click="ok">通 过</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AuditDialog',
  props: {
    text: {
      type: String,
      default: null,
      required: false
    }
  },
  data() {
    return {
      textarea: ''
    };
  },
  created() {
    if (this.text !== undefined && this.text !== null) {
      this.textarea = this.text;
    }
  },
  methods: {
    ok() {
      this.$emit('ok', this.textarea);
    },
    reject() {
      this.$emit('reject', this.textarea);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-form-item {
    margin-bottom: 10px;
  }

  .el-dialog__header {
    height: 40px;
    line-height: 40px;
    padding: 0 24px;
    border-bottom: 1px solid rgba(242, 242, 242, 1);
    .el-dialog__title {
      font-size: 14px;
      color: #262626;
      font-weight: 700;
    }
  }
  .el-form-item__label {
    font-weight: 400;
  }
}
</style>
