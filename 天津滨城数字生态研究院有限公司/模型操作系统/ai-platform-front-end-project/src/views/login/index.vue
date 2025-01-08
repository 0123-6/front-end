<template>
  <div class="login-container">
    <img class="head" src="../../assets/images/login/logo-title.png" alt="">
    <div class="login">
      <img class="contain" src="../../assets/images/login/login-box.png" alt="">
      <div class="contain-mian">
        <el-form
          ref="loginForm"
          :model="form"
          status-icon
          :rules="rules"
          class="login-form"
        >
          <div class="welcome">欢迎登录</div>

          <el-form-item prop="userName">
            <el-input
              ref="userName"
              v-model="form.userName"
              type="userName"
              prop="userName"
              placeholder="请输入账号/手机号"
              name="userName"
              class="word"
              auto-complete="on"
            ><i slot="prefix" class="prefix-icon-userName" /></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              autocomplete="off"
              class="word"
            ><i slot="prefix" class="prefix-icon-password" /></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="login-btn" :loading="loading" type="primary" @click.native.prevent="handleLogin" @keyup.enter.native="handleLogin">登录</el-button>
          </el-form-item>
          <span class="forget" @click="lostMessage">忘记密码</span>
        </el-form>
      </div>

    </div>
    <!--备案-->
    <div class="flex justify-center"
         style="position: fixed;width: 100%;">
      <record-com class="" style="position: fixed;bottom: 40px;"></record-com>
    </div>
  </div>
</template>

<script>
import RecordCom from "@/components/RecordCom";
export default {
  name: 'Login',
  components: {RecordCom},
  data() {
    return {
      form: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [{ required: true, message: '请输入正确的账号/手机号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入正确的密码', trigger: 'blur' }]
      },
      loading: false
    };
  },
  mounted() {
    // 绑定enter事件
    this.enterKeyup();
    this.$store.commit('SET_PREVIRE_CLEAR');
  },
  destroyed() {
    // 销毁enter事件
    this.enterKeyupDestroyed();
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // this.loading = true;
          // this.$store.dispatch('user/login', this.form).then(() => {
          //   this.$router.push('/');
          //   this.loading = false;
          // }).catch(() => {
          //   this.loading = false;
          // });
          this.loading = true;
          this.$router.push('/');
          // this.$store.dispatch('user/login', this.form).then(() => {
          //
          //   this.loading = false;
          // }).catch(() => {
          //   this.loading = false;
          // });
        } else {
          return false;
        }
      });
    },
    // enter键的登录事件
    enterKey(event) {
      const componentName = this.$options.name;
      if (componentName === 'Login') {
        const code = event.keyCode
          ? event.keyCode
          : event.which
            ? event.which
            : event.charCode;
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
    lostMessage() {
      this.$router.push('/lost-message');
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  min-width:420px;
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/images/login/background.jpg");
  background-size: cover;
  overflow: hidden;
}
.head {
  position: relative;
  width: 480px;
  top: 50px;
  left: 50%;
  transform: translate(-50%,0);
}
.login {
  width: 400px;
  height: 450px;
  position: relative;
  top: 11%;
  left: 77%;
  transform: translate(-84%,0);
}
.welcome {
  font-family: "PingFang SC";
  margin-bottom: 30px;
  color: #0164FF;
  font-weight: bold;
  font-size: 125%;
}
.contain {
  position: absolute;
  width: 400px;
  top: 10px;
}
.contain-mian {
  position: absolute;
  left: 70px;
  top: 90px;
}
.phone {
  position: absolute;
  bottom: 81px;
}
.login-form {
  width: 250px;
  right: 200px;
}
.login-btn {
  position: absolute;
  background-color: #0164FF;
  top: 25px;
  width: 250px;
  height: 40px;
  border-radius: 5px 5px 5px 5px;
}
.el-button:focus{
  background-color:#0358DC
}

.prefix-icon-userName {
  position: absolute;
  background: url("../../assets/images/login/phone.png") center no-repeat;
  left: 5px;
  top: 9px;
  height: 18px;
}
.prefix-icon-userName:before {
  content: "\8d3a";
  font-size: 10px;
  visibility: hidden;
}
.prefix-icon-password {
  position: absolute;
  background: url("../../assets/images/login/password.png") center no-repeat;
  left: 5px;
  top: 9px;
  height: 18px;
}
.prefix-icon-password:before {
  content: "\8d3a";
  font-size: 14px;
  visibility: hidden;
}
.word {
  font-size: 10px;
  height: 0;
}
.word>>>input {
  color: rgb(84, 84, 84);
  font-family:"微软雅黑"
}
.el-form-item >>> .el-form-item__error {
  padding-top: 0.33rem;
  font-family:"微软雅黑";
  font-size: 0.2rem;
  font-weight: bold;
}
.forget {
  position: absolute;
  left: 200px;
  top: 245px;
  font-size: 50%;
  color: gray;
  cursor:pointer;
}
</style>
