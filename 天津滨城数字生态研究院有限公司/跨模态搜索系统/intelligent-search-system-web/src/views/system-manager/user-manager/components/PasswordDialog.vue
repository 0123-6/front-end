<template>
  <el-dialog
    v-dialogDrag
    title="修改密码"
    visible
    width="480px"
    :close-on-click-modal="false"
    :custom-class="'password-dialog'"
    :before-close="cancelOperation"
  >
    <el-form
      ref="ruleFormEL"
      :model="ruleForm"
      :rules="rules"
      label-width="90px"
      label-suffix=":"
    >
      <el-form-item label="当前密码" prop="oldPassword">
        <el-input v-model="ruleForm.oldPassword" type="password" placeholder="请输入当前密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="ruleForm.newPassword" type="password" placeholder="请输入新密码" />
        <div class="tip-container">(建议：字母、数字的组合，6-30位)</div>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input v-model="ruleForm.checkPass" type="password" placeholder="请再次输入新密码" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel" @click="cancelOperation">取消</el-button>
      <el-button class="primary" @click="saveOperation">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import _debounce from 'lodash/debounce.js';

export default {
  name: 'Password-dialog',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,30}$/.test(value)) {
        callback(new Error('密码需为6-30位字母、数字的组合'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleFormEL.validateField('checkPass');
        }
        callback();
      }
    };
    const validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,30}$/.test(value)) {
        callback(new Error('密码需为6-30位字母、数字的组合'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
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
    // 确定按钮
    saveOperation: _debounce(function () {
      this.$refs.ruleFormEL.validate((valid) => {
        if (valid) {
          this.$emit('save', this.ruleForm);
          return true;
        }
        return false;
      });
    }, 300),
    // 取消按钮
    cancelOperation() {
      this.$emit('cancel');
    }
  }

};
</script>

<style lang="less" scoped>
.tip-container{
  height: 24px;
  font-size: 12px;
  color: #B7B7B7;
  font-weight: 400;
}
::v-deep .el-dialog__body {
  padding: 16px 24px;
}
</style>
