<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-27 17:01:14
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 12:42:37
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\components\line-dialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    v-dialogDrag
    title="提示"
    visible
    :width="width"
    :close-on-click-modal="false"
    append-to-body
    :before-close="cancel"
  >
    <div class="flex flex-direction align-center" style="width: 100%;">
      <div class="flex color-content margin-16">
        <div v-if="content===''">
          确定{{ title }}吗？
        </div>
        <div v-else>
          {{ content }}
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="white-btn" @click="cancel">取 消</el-button>
      <el-button class="blue-btn" @click="ok">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Index',
  props: {
    title: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: '600px'
    },
    content: {
      required: false,
      type: String,
      default: ''
    }
  },
  methods: {
    ok() {
      this.$emit('ok');
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
    .el-dialog__body {
      text-align: center;
    }
  }
}
</style>
