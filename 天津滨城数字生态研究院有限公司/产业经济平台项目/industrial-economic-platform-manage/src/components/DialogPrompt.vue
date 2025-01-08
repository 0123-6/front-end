<template>
  <!--最外层-->
  <el-dialog v-dialog-drag
             :title="title"
             width="400px"
             :modal-append-to-body="false"
             custom-class="dialog-prompt"
             visible
             :before-close="handleClose">
    <div class="tw-w-full tw-min-h-[165px] tw-flex tw-flex-col tw-items-center">
      <!--插槽-->
      <slot name="content" />
      <!--按钮-->
      <div class="tw-flex tw-items-center tw-mt-[48px]">
        <el-button class="tw-mr-[8px]" @click="clickCancel" style="border-radius: 8px;" size="medium">取消</el-button>
        <el-button type="primary" @click="clickOk" style="border-radius: 8px;" size="medium">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogPrompt',
  props: {
    title: {
      type: String,
      required: false,
      default: '提示',
    },
  },
  data() {
    return {

    };
  },
  methods: {
    handleClose(done) {
      this.$emit('on-cancel');
      done();
    },
    clickCancel() {
      this.$emit('on-cancel');
    },
    clickOk() {
      this.$emit('on-ok');
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep {
  .dialog-prompt {
    .el-button:not(.el-button--text) {
      padding: 8px 15px!important;
    }
    .el-dialog__body {
      padding: 0!important;
    }
  }
}
</style>
