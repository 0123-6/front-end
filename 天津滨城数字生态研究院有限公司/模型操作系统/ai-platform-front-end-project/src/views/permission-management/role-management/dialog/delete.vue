<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-09-06 11:53:27
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 12:45:39
 * @FilePath: \ai-platform-front-end-project\src\views\permission-management\role-management\dialog\delete.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    v-dialogDrag
    title="提示"
    visible
    :width="'380px'"
    :top="'300px'"
    :custom-class="'dialog'"
    :close-on-click-modal="false"
    append-to-body
    :before-close="cancel"
  >
    <div class="flex flex-direction" style="width: 100%;margin-top: -16px;">
      <div class="flex border-bottom" style="width: 100%;" />
      <div class="flex flex-direction" style="width: 100%;height:100px; align-items:center;justify-content:center;">
        <span>确认删除<span style="color:#0164FF">{{ person }}</span>角色么？ </span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="white-btn" @click="cancel">取 消</el-button>
        <el-button class="blue-btn" @click="ok">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Delete',
  props: {
    person: {
      type: String,
      default: ''
    }},
  data() {
    return {
    };
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
  .dialog {
    border-radius: 4px;
    .el-dialog__header {
      height: 50px;
      line-height: 35px;
      padding: 0 24px;
      .el-dialog__title {
        font-family: SourceHanSansSC-Bold;
        font-size: 14px;
        color: #262626;
        letter-spacing: 0;
        line-height: 1px;
        font-weight: 700;
      }
    }
    .el-dialog__body {
      padding: 0;
      text-align: center;
    }
    .dialog-footer {
      padding: 24px 0 24px 0 ;
      padding-top: 0;
    }
  }
}
</style>
