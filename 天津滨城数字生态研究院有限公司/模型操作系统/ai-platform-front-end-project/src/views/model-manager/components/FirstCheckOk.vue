<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-06-22 08:58:10
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 15:17:16
 * @FilePath: \ai-platform-front-end-project\src\views\model-manager\components\FirstCheckOk.vue
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
      <div class="flex font-size-14 color-content">
        确认符合要求，初审通过。
      </div>
      <div class="margin-top-16">
        <el-form :inline="true" label-suffix=":">
          <el-form-item label="备注信息" label-width="100">
            <el-input
              v-model="textarea"
              style="width: 300px"
              type="textarea"
              :rows="6"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-form>
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
  name: 'FirstCheckOk',
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
    // 部署模型
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
