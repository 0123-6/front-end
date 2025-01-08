<template>
  <el-dialog v-dialog-drag
             title="编辑"
             width="520px"
             :modal-append-to-body="false"
             custom-class="edit-dialog"
             visible
             :before-close="handleClose">
    <!--最外层-->
    <div class="tw-pt-[30px] tw-box-border tw-w-full tw-h-[375px] tw-bg-white tw-flex tw-flex-col">
      <!--表单-->
      <el-form ref="form" :model="form" :rules="rules" :inline="true" :close-on-click-modal="false">
        <!--名称-->
        <el-form-item prop="title" label="名称">
          <el-input v-model="form.title" prop="title" placeholder="请输入名称" class="word" auto-complete="off" style="width: 372px;"/>
        </el-form-item>
        <!--描述-->
        <el-form-item prop="description" label="描述">
          <el-input v-model="form.description"
                    :rows="9"
                    type="textarea"
                    prop="description"
                    placeholder="请输入描述"
                    class="word"
                    auto-complete="off"
                    style="width: 372px;"
                    @keydown.enter.native="clickOk"
                    maxlength="500"
                    show-word-limit
          />
        </el-form-item>
      </el-form>
      <!--按钮-->
      <div class="tw-w-full tw-flex tw-justify-center tw-items-center">
        <el-button class="tw-mr-[8px]" @click="clickCancel" style="border-radius: 2px;width: 61px;" size="medium">取消</el-button>
        <el-button type="primary" @click="clickOk" style="border-radius: 2px;width: 61px;" size="medium">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditDialog',
  props: {
    singleSelection: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        title: '',
        description: '',
      },
      rules: {
        title: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.form.title = this?.singleSelection?.title;
    this.form.description = this?.singleSelection?.description;
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
      // 表单验证
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('on-ok', this.form);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
::v-deep {
  .edit-dialog {
    .el-dialog__body {
      padding: 0;
    }
    .el-form-item__label {
      width: 98px;
      padding-right: 8px;
      line-height: 38px;
      color: #1A262C;
    }
    .el-input--medium .el-input__inner {
      height: 38px;
      line-height: 38px;
    }
    .el-form-item {
      margin-bottom: 24px;
      .el-textarea .el-input__count {
        line-height: 12px;
      }
    }
  }
}
</style>
