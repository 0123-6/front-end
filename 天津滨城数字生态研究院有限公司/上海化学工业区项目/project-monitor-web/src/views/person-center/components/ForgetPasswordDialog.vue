<template>
  <!--最外层-->
  <div class="w-full h-[284px] flex flex-col">
    <el-form :model="form" ref="form" :rules="rules" label-width="128px" label-suffix="：" class="mt-5">
      <!--绑定的手机号-->
      <el-form-item label="绑定的手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入绑定的手机号" auto-complete="off" style="width: 308px;"></el-input>
      </el-form-item>
      <!--验证码-->
      <el-form-item prop="code" label="验证码">
        <div class="flex items-center">
          <el-input v-model="form.code" placeholder="请输入验证码" autocomplete="off" style="width: 205px;" class="word">
          </el-input>
          <div class="ml-2 h-full flex justify-center items-center"
            :class="[(phoneOk && !isSend) ? 'cursor-pointer' : 'cursor-not-allowed']" @click="sendVerificationCode">
            <div class="w-[94px] h-[32px] flex justify-center items-center rounded"
              :class="[(phoneOk && !isSend) ? 'bg-main hover:bg-main-hover active:bg-main-active' : 'bg-[#EDEDED]']">
              <!--正常-->
              <span v-if="!isSend" class="text-sm" :class="[(phoneOk) ? 'text-white' : ('text-[#B8BABF]')]">{{ (sendPhone
                && form.phone === sendPhone) ? '重新发送' : '获取验证码' }}</span>
              <!--60s倒计时中-->
              <span v-if="isSend" class="text-sm text-main">{{ beforeSecondSend + 's' }}</span>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" auto-complete="off"
          style="width: 308px;"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" placeholder="请确认新密码" auto-complete="off"
          style="width: 308px;" @keyup.enter="onOk"></el-input>
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
  name: "ForgetPasswordDialog",
  emits: ['go-forget-password', 'on-ok', 'on-cancel'],
  data() {
    return {
      // 表单
      form: {
        // 绑定的手机号
        phone: '',
        // 验证码
        code: '',
        // 新密码
        newPassword: '',
        // 确认新密码
        confirmPassword: '',
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机格式不正确', }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          // 只能是数字，长度为4
          { pattern: /^\d{4}$/, message: '验证码格式不正确', trigger: 'blur' },
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
      // 是否发送验证码
      isSend: false,
      loading: false,
      beforeSecondSend: 60,
      // 定时器
      timer: null,
      phoneOk: false,
      // 发送验证码的手机号
      sendPhone: '',
    };
  },
  watch: {
    show(val) {
      this.init();
    },
    // 监听form.userPhoneNumber的变化,如果满足手机号格式,则设置phoneOk为true，可以发送验证码
    form: {
      handler(val) {
        this.phoneOk = /^1[3456789]\d{9}$/.test(val.phone);
      },
      deep: true,
    },
  },
  methods: {
    init() {
      // 初始化表单
      this.form = {
        phone: '',
        code: '',
        newPassword: '',
        confirmPassword: '',
      };
      // 重置表单验证
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
      // 重置发送验证码
      this.isSend = false;
      this.beforeSecondSend = 60;
      this.sendPhone = '';
      // 清除定时器
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
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
    // 发送验证码
    async sendVerificationCode(_e) {
      if (!(this.phoneOk && !this.isSend)) {
        return;
      }
      console.log('into sendVerificationCode');
      _e.stopPropagation();
      _e.preventDefault();
      // 校验手机号是否正确,正确则获取手机号
      const params = {
        phone: this.form.phone,
      };
      // 发送验证码
      // await post('/user/sms/forgot_pwd', params);
      this.sendPhone = this.form.phone;
      this.isSend = true;
      this.timer = setInterval(() => {
        this.beforeSecondSend -= 1;
        if (this.beforeSecondSend <= 0) {
          clearInterval(this.timer);
          this.timer = null;
          this.isSend = false;
          this.beforeSecondSend = 60;
        }
      }, 1000);
    },
  },
}
</script>

<style lang="scss"></style>
