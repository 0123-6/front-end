<template>
  <div class="login-container">
    <div class="title">
      <div class="title-content">
        <img
          src="@/assets/images/login/company_logo.png"
          alt=""
        >
        <div>城市监控视频跨模态搜索系统</div>
      </div>
    </div>
    <div class="login">
      <div style="display: flex;align-items: center;width: 80%;height: 100%;margin-left:20%">
        <el-form
          ref="loginForm"
          :model="form"
          status-icon
          :rules="rules"
          class="login-form"
        >
          <div class="welcome">欢迎登录</div>

          <el-form-item prop="userName" label="账户">
            <el-input
              ref="userName"
              v-model="form.userName"
              type="userName"
              prop="userName"
              placeholder="请输入账号/手机号"
              name="userName"
              class="word"
              auto-complete="on"
            >
<!--              <i slot="prefix" class="prefix-icon-userName" />-->
            </el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入登陆密码"
              autocomplete="off"
              class="word"
            >
<!--              <i slot="prefix" class="prefix-icon-password" />-->
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-btn primary"
              :loading="loading"
              type="primary"
              @click.native.prevent="handleLogin"
              @keyup.enter.native="handleLogin"
            >登录</el-button>
          </el-form-item>
          <!--          <span class="forget" @click="lostMessage">忘记密码</span>-->
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { login, getUserInfo } from '@/api/common';

export default {
  name: 'login-page',
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
  },
  destroyed() {
    // 销毁enter事件
    this.enterKeyupDestroyed();
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          login(this.form).then((res) => {
            if (res.code === '000000') {
              getUserInfo(res.data.loginId).then((result) => {
                if (res.code === '000000') {
                  const user = Object.assign(res.data, result.data);
                  this.$store.commit('Common/ADD_USER_INFO', user);
                  sessionStorage.setItem('loginInfo', JSON.stringify(user));
                  this.$router.replace({
                    name: 'HomePage'
                  });
                }
              });
              this.loading = false;
            }
          }).catch(() => {
            this.loading = false;
          });
        }
      });
    },
    // enter键的登录事件
    enterKey(event) {
      const componentName = this.$options.name;
      if (componentName === 'login-page') {
        // eslint-disable-next-line no-nested-ternary
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

<style lang="less" scoped>
.login-container {
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  background: url("../../assets/images/login/bg.svg");
  background-size: cover;
  overflow: hidden;
}
.title{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40%;
  background: #0C8DAA;
  background: url("../../assets/images/login/left_bg.jpg");
  background-size: cover;
  overflow: hidden;
  .title-content{
    >img{
      margin: auto;
    }
    >div{
      margin-top: 34px ;
      font-family: SourceHanSansSC-Bold;
      font-size: 32px;
      color: #FFFFFF;
      letter-spacing: 0;
      font-weight: 700;
    }
  }
}
.login {
  width: 60%;
  height: 100%;
}
.welcome {
  font-family: SourceHanSansSC-Bold;
  font-size: 32px;
  color: #262626;
  letter-spacing: 0;
  font-weight: 700;
  margin-bottom: 30px;
}
.phone {
  position: absolute;
  bottom: 81px;
}
.login-form {
  width: 460px;
}
.login-btn {
  width: 460px;
  height: 40px;
  box-shadow: 0 2px 6px 0 rgba(12,97,170,0.29);
  border-radius: 8px;
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
::v-deep .el-form-item__label{
  font-family: SourceHanSansSC-Bold;
  font-size: 16px;
  color: #262626;
  letter-spacing: 0;
  font-weight: 700;
}
::v-deep .el-input__inner{
  background: #FFFFFF;
  border: 1px solid rgba(230,230,230,1);
  border-radius: 8px;
  &:focus {
    box-shadow: 0 6px 8px 0 rgb(151,186,225,0.24);
  }
}
.word {
  font-size: 10px;
  height: 0;
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
