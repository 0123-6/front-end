<template>
  <el-dialog
    v-dialogDrag
    :title="state === 'create'?'创建':'编辑用户'"
    visible
    width="560px"
    :close-on-click-modal="false"
    :custom-class="'detail-dialog'"
    :before-close="cancelOperation"
  >
    <el-form ref="ruleFormEL" :model="ruleForm" :rules="rules" label-width="60px" label-suffix=":">
      <el-form-item label="账号" prop="userName">
        <el-input class="name-input"
                  v-model="ruleForm.userName"
                  placeholder="请输入手机号或点击按钮随机生成账号" clearable />
        <el-button class="primary plain create" @click="createUsername">生成账号</el-button>
      </el-form-item>
      <el-form-item label="姓名" prop="nickName">
        <el-input v-model="ruleForm.nickName" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="单位" prop="company">
        <el-input v-model="ruleForm.company" placeholder="请输入单位" clearable />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="ruleForm.roleId" placeholder="请选择角色">
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phonenumber">
        <el-input v-model="ruleForm.phonenumber" placeholder="请输入正确的手机号" clearable />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" placeholder="请输入正确的邮箱" clearable />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button class="cancel" @click="cancelOperation">取消</el-button>
      <el-button class="primary" @click="saveOperation">确认</el-button>
    </span>
  </el-dialog>
</template>
<script>
import _debounce from 'lodash/debounce.js';
import { generateUserName } from '@/api/user-manage';

export default {
  props: {
    state: {
      type: String,
      default: 'create',
      required: true
    },
    detailForm: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      roleOptions: [
        { label: '超级管理员', value: '1' },
        { label: '普通用户', value: '2' }
      ],
      rules: {
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        phonenumber: [
          {
            required: false,
            message: '请输入正确的手机格式',
            pattern: /^1[3456789]\d{9}$/,
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: false,
            message: '请输入正确的邮箱格式',
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+[- | a-z0-9A-Z . _]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    ruleForm: {
      get() {
        return this.detailForm;
      },
      set(newValue) {
        this.$emit('update:detailForm', newValue);
      }
    }
  },
  methods: {
    // 取消按钮
    cancelOperation() {
      this.$emit('cancel');
    },
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
    // 重置
    resetForm() {
      this.$refs.ruleFormEL.resetFields();
    },
    // 清楚
    clearForm() {
      this.$refs.ruleFormEL.clearValidate();
    },
    // 生成随机账号
    createUsername: _debounce(function () {
      generateUserName().then((result) => {
        this.$set(this.ruleForm, 'userName', result.data.data[0]);
      }).catch((err) => {
      });
    }, 300)
  }
};
</script>
<style lang="less" scoped>
.detail-dialog {
  .name-input {
    width: calc(100% - 82px);
  }
  .el-button {
    &.create {
      margin-left: 8px;
      padding: 8px !important;
    }
  }
  .el-select {
    width: 100%;
  }
}
::v-deep .el-dialog__body {
  padding: 24px 56px;
}
</style>
