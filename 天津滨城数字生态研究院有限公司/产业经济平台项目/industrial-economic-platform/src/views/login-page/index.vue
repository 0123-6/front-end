<template>
  <div class="home-container">
    <img class="title" src="@/assets/icons/logo.svg" style="height: 42px; cursor: pointer" @click="$router.push('/home')" />
    <img class="login-figure" src="@/assets/images/login/login-figure.png" />
    <div class="info-container">
      <login-comp v-if="mode === 'login'" @changeMode="changeMode" />
      <register-comp v-if="mode === 'register'" @changeMode="changeMode" />
      <find-password-comp v-if="mode === 'findPassword'" @changeMode="changeMode" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import LoginComp from '@/views/login-page/components/LoginComp';
import RegisterComp from '@/views/login-page/components/RegisterComp';
import FindPasswordComp from "@/views/login-page/components/FindPasswordComp";
// eslint-disable-next-line import/no-extraneous-dependencies
const md5 = require('js-md5');

export default {
  name: 'LoginPage',
  components: {
    FindPasswordComp,
    LoginComp,
    RegisterComp
  },
  data() {
    return {
      // 模式，登录login, 或注册register,或找回密码findPassword
      mode: 'login'
    };
  },
  created() {
    // 判断url的参数isRegister，如果是true，则切换到注册模式
    const isRegister = this.$route.query.isRegister;
    if (isRegister) {
      this.mode = 'register';
    }
  },
  methods: {
    changeMode(mode) {
      this.mode = mode;
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
.home-container {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100vh;
  min-height: 768px;
  min-width: 1366px;
  overflow: hidden;
  background: url('@/assets/images/login/login-bg.png') no-repeat center fixed;
  background-size: cover;
  .title {
    position: absolute;
    left: 100px;
    top: 50px;
    //width: 370px;
    //height: 74px;
  }
  .info-container {
    // width: 40%;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: center;
  }

  .login-figure {
    width: 700px;
    height: auto;
  }
  @media screen and (max-width: 1500px) {
    .login-figure {
      width: 620px;
    }
  }
}

::v-deep {
  .el-form-item__label {
    color: #1a262c;
    font-family: PingFang SC;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px; /* 137.5% */
    margin-bottom: 8px;
  }
  .el-form-item {
    margin-bottom: 28px;
  }
  .el-input__inner {
    height: 48px;
    line-height: 48px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
  }
  .validate-item {
    .el-form-item__content {
      display: flex;
    }
  }
  .el-checkbox__label {
    color: #9ca4ab;
    font-family: PingFang SC;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
  }
  .el-checkbox__inner {
    border-radius: 4px;
  }
}
</style>
