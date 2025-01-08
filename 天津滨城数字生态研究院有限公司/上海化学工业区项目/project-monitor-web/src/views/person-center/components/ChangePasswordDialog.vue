<template>
  <!--最外层-->
  <div class="w-full h-[229px] flex flex-col">
    <el-form :model="form" ref="form" :rules="rules" label-width="128px" label-suffix="：" class="mt-5">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="form.oldPassword" type="password" placeholder="请输入旧密码" auto-complete="off"
          style="width: 244px;"></el-input>
        <el-button type="primary" link class="ml-1.5 text-xs" @click="goForgetPassword">忘记密码</el-button>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" auto-complete="off"
          style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" placeholder="请确认新密码" auto-complete="off"
          style="width: 300px;" @keyup.enter="onOk"></el-input>
      </el-form-item>
    </el-form>
    <!--底部按钮-->
    <div class="pr-8 flex justify-end items-center">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" style="margin-left: 8px;" @click="onOk">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChangePasswordDialog",
  emits: ['go-forget-password', 'on-ok', 'on-cancel'],
  data() {
    return {
      // 表单
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          // 校验,数字/字母/特殊符号任意两种组合,最少6位，最多18位,变化时校验
          {
            validator: (rule, value, callback) => {
              const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![^0-9a-zA-Z]+$).{6,18}$/;
              if (!reg.test(value)) {
                callback(new Error('数字/字母/特殊符号任意两种组合,最少6位，最多18位'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          // 校验,数字/字母/特殊符号任意两种组合,最少6位，最多18位,变化时校验
          {
            validator: (rule, value, callback) => {
              const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![^0-9a-zA-Z]+$).{6,18}$/;
              if (!reg.test(value)) {
                callback(new Error('数字/字母/特殊符号任意两种组合,最少6位，最多18位'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          },
        ],
        confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          // 若两次输入新密码不一致，则提示”新密码不一致，请重新输入”:
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.newPassword) {
                callback(new Error('新密码不一致，请重新输入'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          },
        ],
      },
    };
  },
  watch: {
    show(val) {
      this.init();
    }
  },
  methods: {
    init() {
      this.form = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
      // 重置表单验证
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    onOk() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form));
          this.$emit('on-ok', params);
        }
      });
    },
    onCancel() {
      this.$emit('on-cancel');
    },
    goForgetPassword() {
      this.$emit('go-forget-password');
    },
  },
}
</script>

<style lang="scss">
// 已提取到全局
</style>
