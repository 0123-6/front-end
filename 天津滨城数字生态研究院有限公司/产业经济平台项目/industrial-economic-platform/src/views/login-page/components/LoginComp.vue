<template>
  <!--最外层-->
  <div class="form-container">
    <div class="welcome">欢迎登录</div>
    <div class="tw-mb-[42px] tw-w-full tw-flex tw-items-center tw-text-sm">
      <span class="tw-text-[#9CA4AB] tw-leading-5">没有账号去</span>
      <span class="tw-text-main tw-leading-5 tw-cursor-pointer" @click="goRegister">注册</span>
    </div>
    <el-form ref="loginForm" :model="form" :rules="rules" class="login-form">
      <el-form-item prop="username" label="账号">
        <el-input v-model="form.username" type="username" prop="username" placeholder="请输入登录账号" class="word" auto-complete="off"> </el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="请输入登录密码"
          autocomplete="off"
          auto-complete="off"
          class="word"
          @keydown.enter.native="handleLogin">
          <div
            class="tw-mr-2 tw-h-full tw-flex tw-justify-center tw-items-center tw-cursor-pointer"
            slot="suffix"
            @click="showPassword = !showPassword">
            <img v-show="!showPassword" src="../icon/HidePasswordSvg.svg" alt="" style="width: 18px; height: 18px" />
            <img v-show="showPassword" src="../icon/ShowPasswordSvg.svg" alt="" style="width: 18px; height: 18px" />
          </div>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="tw-w-full tw-h-[46px] tw-flex tw-flex-col">
      <div class="tw-w-full tw-flex tw-justify-between tw-items-center">
        <el-checkbox v-model="remember">记住此账号</el-checkbox>
        <span class="tw-cursor-pointer tw-text-sm tw-text-[#9CA4AB] hover:tw-text-main"
              @click="goFindPassword">忘记密码</span>
      </div>
    </div>
    <div class="operation">
      <el-button class="login-btn" :loading="loading" @click="handleLogin">登录</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import md5 from 'js-md5';

export default {
  name: 'LoginComp',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入正确的登录账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入正确的登录密码', trigger: 'blur' }]
      },
      remember: false,
      loading: false,
      showPassword: false
    };
  },
  computed: {
    ...mapGetters(['iep_platform_TOKEN', 'iep_platform_ROUTERS_INFO']),
    isLogin() {
      return this.iep_platform_TOKEN?.token || false;
    },
    menuList() {
      return this.iep_platform_ROUTERS_INFO?.filter((item) => item.menuName !== '其他');
    }
  },
  created() {},
  mounted() {
    this.getUser();
    // 绑定enter事件
    this.enterKeyup();
    this.$store.commit('Common/CLEAR_TOKEN');
  },
  destroyed() {
    // 销毁enter事件
    this.enterKeyupDestroyed();
  },
  methods: {
    ...mapActions('account', ['login']),
    getUser() {
      const user = localStorage.getItem('user');
      if (user) {
        this.form = JSON.parse(user);
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.login({
            username: this.form.username,
            password: md5(this.form.password),
            remember: this.remember,
            complete: () => {
              // 请求拦截做了提示，这里不要给提示
              this.loading = false;
            }
          });
        }
      });
    },
    // enter键的登录事件
    enterKey(event) {
      console.log('enterKey', this.$options.name);
      const componentName = this.$options.name;
      if (componentName === 'LoginPage') {
        // eslint-disable-next-line no-nested-ternary
        const code = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
        if (code === 13) {
          this.handleLogin();
        }
      }
    },
    // enter事件销毁
    enterKeyupDestroyed() {
      document.removeEventListener('keyup', this.enterKey);
    },
    // enter事件注册
    enterKeyup() {
      document.addEventListener('keyup', this.enterKey);
    },
    // 去注册
    goRegister() {
      this.$emit('changeMode', 'register');
    },
    // 忘记密码
    goFindPassword() {
      this.$emit('changeMode', 'findPassword');
    },
  }
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
.form-container {
  border-radius: 8px;
  background: #fff;
  padding: 40px 40px 100px;
  box-shadow: 0 0 7px 0 rgba(27, 44, 80, 0.06);
  .operation {
    .login-btn {
      width: 360px;
      height: 50px;
      background: @primary-color;
      border-radius: 6px;
      color: #fff;
      &:hover {
        background: #5183ff;
      }
      &:active {
        background: #2a5dd8;
      }
    }
  }
}

.welcome {
  color: #1a1a1a;
  font-family: PingFang SC;
  font-size: 32px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 15px;
}
</style>
