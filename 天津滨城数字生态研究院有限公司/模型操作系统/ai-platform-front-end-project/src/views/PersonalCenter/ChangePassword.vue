<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-26 20:12:21
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 17:37:50
 * @FilePath: \ai-platform-front-end-project\src\views\PersonalCenter\ChangePassword.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    v-dialogDrag
    title="修改密码"
    visible
    :width="'480px'"
    :close-on-click-modal="false"
    append-to-body
    :custom-class="'change-pass-dialog'"
    :before-close="cancel"
  >
    <div class="flex flex-direction" style="width: 100%;margin-top: -16px;">
      <div class="flex flex-direction" style="width: 100%;">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="142px"
          style="width: 100%;"
          class="margin-top-24"
          label-suffix=":"
        >
          <el-form-item label="当前密码" prop="oldPassword" style="width: 388px;">
            <el-input v-model="form.oldPassword" type="password" placeholder="请输入当前密码" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword" style="width: 388px;">
            <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" />
            <div class="tip-container">(建议：字母、数字的组合，6-30位)</div>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass" style="width: 388px;">
            <el-input v-model="form.checkPass" type="password" placeholder="请再次输入新密码" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="white-btn" @click="cancel">取 消</el-button>
        <el-button class="blue-btn" @click="ok">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import _debounce from 'lodash/debounce';
export default {
  name: 'ChangePassword',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,30}$/.test(value)) {
        callback(new Error('密码需为6-30位字母、数字的组合'));
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass');
        }
        callback();
      }
    };
    var validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,30}$/.test(value)) {
        callback(new Error('密码需为6-30位字母、数字的组合'));
      } else {
        callback();
      }
    };
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        checkPass: ''
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message: '当前密码不能为空',
            trigger: 'blur'
          }
        ],
        newPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validateCheckPass, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    ok: _debounce(function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('ok', this.form);
        } else {
          return false;
        }
      });
    }, 300),
    cancel() {
      this.$emit('cancel');
    }
  }

};
</script>

<style lang="scss" scoped>
::v-deep {
  .change-pass-dialog {
    border-radius: 4px;
    label{
      font-weight: 400;
    }
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
      padding: 24px;
    }
    .el-dialog__footer {
      padding: 24px;
      padding-top: 0;
    }
    .tip-container {
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      color: #a9a9a9;
    }
  }
}
</style>
