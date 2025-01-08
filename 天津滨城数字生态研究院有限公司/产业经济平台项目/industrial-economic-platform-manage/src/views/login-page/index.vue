<template>
  <div class="home-container">
    <img class="title" src="@/assets/icons/logo.svg" style="height: 42px" />
    <div class="info-container">
      <div class="form-container">
        <div class="welcome">欢迎登录</div>
        <el-form ref="loginForm" :model="form" :rules="rules" class="login-form">
          <el-form-item prop="username" label="账号">
            <el-input v-model="form.username" type="username" prop="username" placeholder="请输入登录账号" class="word" auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="请输入登录密码" autocomplete="off" class="word">
              <div
                class="tw-mr-2 tw-h-full tw-flex tw-justify-center tw-items-center tw-cursor-pointer"
                slot="suffix"
                @click="showPassword = !showPassword">
                <img v-show="!showPassword" src="./icon/HidePasswordSvg.svg" alt="" style="width: 18px; height: 18px" />
                <img v-show="showPassword" src="./icon/ShowPasswordSvg.svg" alt="" style="width: 18px; height: 18px" />
              </div>
            </el-input>
          </el-form-item>
        </el-form>
        <el-checkbox v-model="remember">记住此账号</el-checkbox>
        <div class="operation">
          <el-button class="login-btn" :loading="loading" @click="handleLogin">登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { getMenuTreeData, getMetaMenuData, getRegionTreeData, getUserInfo, login } from '@/api/common';
import { getDictAll } from '@/api/company';

export default {
  name: 'login-page',
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
      loading: false,
      remember: false,
      showPassword: false
    };
  },
  mounted() {
    this.getUser();
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
          const user = {};
          user.user = this.form;
          user.isLogin = true;
          login(this.form)
            .then((res) => {
              if (res.code === '00000') {
                const token = res.data;
                token.beginTime = new Date().getTime();
                this.$store.commit('Common/ADD_TOKEN', token);
                this.getMetaMenu();

                getMenuTreeData().then((metaRes) => {
                  if (metaRes.code === '00000') {
                    this.$store.commit('Common/ADD_MENU_TREE', metaRes.data);

                    getUserInfo(res.data).then((userRes) => {
                      if (userRes.code === '00000') {
                        this.$store.commit('Common/ADD_USER_INFO', userRes.data);
                        this.$router.push(metaRes.data[0]?.children[0]?.path);
                        this.loading = false;

                        this.getDict();
                      }
                    });
                  }
                });
                if (this.remember) {
                  localStorage.setItem('adminUser', JSON.stringify(this.form));
                } else {
                  localStorage.removeItem('adminUser');
                }
                this.loading = false;
              } else {
                this.loading = false;
              }
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    async getDict() {
      const { data } = await getDictAll();
      localStorage.setItem('iep_platform_all_dict', JSON.stringify(data));
    },
    getUser() {
      const user = localStorage.getItem('adminUser');
      if (user) {
        this.form = JSON.parse(user);
      }
    },
    getMetaMenu() {
      getMetaMenuData().then((res) => {
        if (res.code === '00000') {
          res.data.sort((a, b) => a.id - b.id);
          this.$store.commit('Common/ADD_META_MENU', res.data);
        }
      });
      getRegionTreeData().then((res) => {
        if (res.code === '00000') {
          this.$store.commit('Common/ADD_CITY_OPTIONS', res.data);
        }
      });
    },
    // enter键的登录事件
    enterKey(event) {
      const componentName = this.$options.name;
      if (componentName === 'login-page') {
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
  justify-content: end;
  width: 100%;
  height: 100vh;
  min-height: 768px;
  min-width: 1366px;
  overflow: hidden;
  background: url('@/assets/images/login/bg.png') no-repeat center fixed;
  background-size: cover;
  .title {
    position: absolute;
    left: 100px;
    top: 50px;
    //width: 370px;
    //height: 74px;
  }
  .info-container {
    width: 40%;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: center;
  }
  .welcome {
    color: #1a1a1a;
    font-family: PingFang SC;
    font-size: 32px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin-bottom: 60px;
  }
  .form-container {
    border-radius: 8px;
    background: #fff;
    padding: 40px 40px 100px;
    box-shadow: 0 0 7px 0 rgba(27, 44, 80, 0.06);
    .operation {
      margin-top: 30px;
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
    margin-bottom: 32px;
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
