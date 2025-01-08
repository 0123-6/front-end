<template>
  <el-dialog v-dialog-drag
             title="登录"
             width="480px"
             :modal-append-to-body="false"
             custom-class="login-dialog"
             visible
             :before-close="handleClose">
    <!--最外层-->
    <div class="tw-pt-[39px] tw-box-border tw-w-full tw-h-[328px] tw-bg-white tw-flex tw-flex-col">
      <el-form ref="loginForm" :model="form" :rules="rules" class="login-form" :inline="true" :close-on-click-modal="false">
        <el-form-item prop="username" label="账号">
          <el-input v-model="form.username" type="username" prop="username" placeholder="请输入登录账号" class="word" auto-complete="off" style="width: 318px;">
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" class="tw-mt-[9px]">
          <el-input v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="请输入登录密码"
                    autocomplete="off"
                    class="word"
                    style="width: 318px;"
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
      <div class="tw-ml-[101px] tw-box-border tw-w-[318px] tw-flex tw-justify-between tw-items-center">
        <el-checkbox v-model="remember">记住账号</el-checkbox>
        <span class="tw-cursor-pointer tw-text-sm tw-text-[#9CA4AB] hover:tw-text-main"
              @click="goFindPassword">忘记密码</span>
      </div>
      <el-button class="tw-mt-[22px] login-btn tw-ml-[101px]" :loading="loading" @click="handleLogin">登录</el-button>
      <div class="tw-ml-[101px] tw-mt-[17px] tw-flex tw-items-center tw-text-sm tw-h-[20px] tw-leading-[20px]">
        <span class="tw-text-[#9CA4AB]">没有账号去</span>
        <span class="tw-text-main hover:tw-text-main-hover active:tw-text-main-active tw-cursor-pointer"
              @click="goRegister">注册</span>
      </div>
    </div>
  </el-dialog>
</template>

<script>

import {
  mapActions,
  mapGetters
} from 'vuex';
import md5 from 'js-md5';

export default {
  name: 'LoginDialog',
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
  methods: {
    ...mapActions('account', ['login']),
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.login({
            username: this.form.username,
            password: md5(this.form.password),
            remember: this.remember,
            complete: () => {
              console.log('this.isLogin', this.isLogin);
              if (this.isLogin) {
                this.$message({
                  message: '登录成功',
                  type: 'success',
                });
                this.$emit('close');
              } else {
                this.$message({
                  message: '登录失败',
                  type: 'error',
                });
              }
              this.loading = false;
            }
          });
        }
      });
    },
    // 去注册
    goRegister() {
      this.$emit('goRegister');
    },
    // 忘记密码
    goFindPassword() {
      console.log('忘记密码');
      this.$emit('goFindPassword');
    },
    handleClose(done) {
      this.$emit('close');
      done();
    },
  },
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
::v-deep {
  .login-dialog {
    .el-dialog__body {
      padding: 0;
    }
    .el-form-item__label {
      width: 101px;
      padding-right: 8px;
      line-height: 40px;
      color: #1A262C;
    }
    .el-input--medium .el-input__inner {
      height: 40px;
      line-height: 40px;
    }
    .el-form-item {
    }
    .login-btn {
      width: 318px;
      height: 40px;
      background: @primary-color;
      border-radius: 2px;
      color: #fff;
      &:hover {
        background: @primary-hover-color;
      }
      &:active {
        background: @primary-focus-color;
      }
    }
  }
}
</style>
