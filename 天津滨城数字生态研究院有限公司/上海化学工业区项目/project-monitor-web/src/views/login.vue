<template>
  <div class="login flex-y ai-center jc-around">
    <div class="login-title d-flex ai-center">
      <svg-icon class-name="login-logo" icon-class="logo" width="120px" height="37px" color="#fff" />
      <div>建设项目全周期监测应用</div>
    </div>
    <div class="login-content flex-center">
      <div class="login-img flex-y-center flex-1">
        <img src="@/assets/images/login-img.png">
      </div>
      <div class="login-form flex-1 flex-y ai-center jc-center">
        <div class="form-title text-center">欢迎登录</div>
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item prop="username">
            <el-input v-model="form.username" type="text" size="large" auto-complete="off" placeholder="请输入登录账号">
              <template #prefix>
                账号
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" style="margin-bottom: 0;">
            <el-input v-model="form.password" type="password" show-password size="large" auto-complete="off"
              placeholder="请输入登录密码" @keyup.enter="handleLogin">
              <template #prefix>
                密码
              </template>
            </el-input>
          </el-form-item>
          <div class="remember-me">
            <el-radio v-model="form.rememberMe" :label="true">记住此账号</el-radio>
          </div>
          <el-form-item style="margin-bottom: 17px;">
            <el-button :loading="loading" size="large" type="primary" @click.prevent="handleLogin" style="width:100%">
              <span v-if="!loading">立即登录</span>
              <span v-else>登录中...</span>
            </el-button>
          </el-form-item>
          <div class="flex-center mt24">
            <el-button type="primary" link @click="showForgetPwd = true">忘记密码</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <div class="bottom-hold"></div>
    <ForgetPwd v-if="showForgetPwd" @close="showForgetPwd = false" />
  </div>
</template>

<script>
import useUserStore from '@/store/modules/user';
import ForgetPwd from './ForgetPwd.vue';

export default {
  name: 'Login',
  components: { ForgetPwd },
  data() {
    return {
      loading: false,
      form: {
        username: '',
        password: '',
      },
      rules: {
        projectId: '',
        username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
        password: [{ required: true, triggerLOgo: 'blur', message: '请输入您的密码' }]
      },
      showForgetPwd: false
    }
  },
  created() {
    const localName = localStorage.getItem('cip_username')
    if (localName) {
      this.form.username = localName
    }
  },
  methods: {
    handleLogin() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            const { rememberMe, username } = this.form
            await useUserStore().login(this.form)
            this.$router.push({ path: '/index' });
            this.loading = false;
            localStorage.setItem('cip_username', rememberMe ? username : '')
          } catch (error) {
            this.loading = false;
          }
        }
      });
    }
  }
}
</script>

<style lang='scss'>
.login {
  height: 100%;
  min-width: 1440px;
  min-height: 768px;
  background-color: #e6ebf2;
  background-image: url('@/assets/images/login-bg.webp');
  background-size: cover;
  background-position: 50%;

  .login-logo {
    margin-right: 10px;
  }

  .login-title {
    padding-left: 5%;
    width: 100%;
    color: #fff;
    font-size: 41px;
    font-weight: 600;
  }

  .login-content {
    width: 56.04%;
    height: 54.62%;
    min-width: 800px;
    min-height: 500px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.07);
    border-radius: 20px;
  }

  .login-img {
    height: 100%;
    background: linear-gradient(170deg, rgba(242, 252, 255, 0.40) -2.92%, rgba(223, 246, 255, 0.40) 101.5%);
    border: 1px solid #E8F9FF;
    box-shadow: 0px 4.77122px 11.92806px 0px rgba(3, 173, 235, 0.10) inset;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;

    img {
      width: 75.84%;
      pointer-events: none;
    }
  }

  .login-form {
    height: 100%;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background: #ffffff;
  }

  .form-title {
    color: #1a1a1a;
    font-size: 32px;
    font-weight: 600;
    letter-spacing: 5.5px;
  }

  .el-form {
    margin-top: 53px;
    width: 73.8%;

    &-item {
      margin-bottom: 33px;
    }
  }

  .el-input {
    height: 52px;
    line-height: 52px;

    &__inner {
      height: 50px;
      line-height: 50px;
    }

    &__prefix {
      position: relative;
      padding-left: 8px;
      padding-right: 12px;
      color: #707985;

      &::before {
        content: '*';
        position: absolute;
        top: 2px;
        left: 0;
        color: #CC4F47;
        font-size: 16px;
      }

    }

    &__wrapper {
      background: #F7F8FA;
      box-shadow: none;
    }
  }

  .remember-me {
    padding: 21px 0;
  }

  .el-radio {
    color: #9CA4AB;

    &__label {
      font-weight: 400;
    }
  }

  .bottom-hold {
    height: 57px;
    width: 1px;
    pointer-events: none;
  }
}
</style>
