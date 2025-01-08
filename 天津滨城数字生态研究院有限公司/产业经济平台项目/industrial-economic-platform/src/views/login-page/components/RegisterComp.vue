<template>
  <!--最外层-->
  <div class="form-container register-page">
    <div class="welcome">欢迎注册</div>
    <div class="tw-mb-[24px] tw-w-full tw-flex tw-items-center tw-text-sm">
      <span class="tw-text-[#9CA4AB] tw-leading-5">已有账号去</span>
      <span class="tw-text-main tw-leading-5 tw-cursor-pointer"
            @click="goLogin">登录</span>
    </div>
    <el-form ref="registerForm" :model="form" :rules="rules" class="login-form">
      <!--姓名-->
      <el-form-item prop="nickname" label="姓名">
        <el-input v-model="form.nickname" type="nickname" prop="nickname" placeholder="请输入姓名" class="word" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="userPhoneNumber" label="手机号">
        <el-input v-model="form.userPhoneNumber" type="userPhoneNumber" prop="userPhoneNumber" placeholder="请输入手机号" class="word" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="code" label="验证码">
        <el-input v-model="form.code"
                  placeholder="请输入验证码"
                  autocomplete="off"
                  class="word"
                  @keydown.enter.native="handleRegister">
          <div
            class="tw-mr-2 tw-h-full tw-flex tw-justify-center tw-items-center"
            :class="[(phoneOk&&!isSend) ? 'tw-cursor-pointer' : 'tw-cursor-not-allowed']"
            slot="suffix"
            @click="sendVerificationCode">
            <div class="tw-w-[90px] tw-h-[25px] tw-flex tw-justify-center tw-items-center tw-rounded-sm"
                 :class="[(phoneOk&&!isSend) ? 'tw-bg-main hover:tw-bg-main-hover active:tw-bg-main-active' : 'tw-bg-[#EDEDED]']">
              <!--正常-->
              <span v-if="!isSend"
                    class="tw-text-sm"
                    :class="[(phoneOk) ? 'tw-text-white' : ('tw-text-[#B8BABF]')]">{{(sendPhone && form.userPhoneNumber === sendPhone) ? '重新发送' : '获取验证码'}}</span>
              <!--60s倒计时中-->
              <span v-if="isSend"
                    class="tw-text-sm tw-text-main">{{beforeSecondSend+'s'}}</span>
            </div>
          </div>
        </el-input>
      </el-form-item>
      <!--密码-->
      <el-form-item prop="password" label="密码">
        <el-input
          prop="password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="请输入登录密码"
          autocomplete="off"
          auto-complete="off"
          class="word"
        >
          <div
            class="tw-mr-2 tw-h-full tw-flex tw-justify-center tw-items-center tw-cursor-pointer"
            slot="suffix"
            @click="showPassword = !showPassword"
          >
            <img v-show="!showPassword" src="../icon/HidePasswordSvg.svg" alt="" style="width: 18px; height: 18px" />
            <img v-show="showPassword" src="../icon/ShowPasswordSvg.svg" alt="" style="width: 18px; height: 18px" />
          </div>
        </el-input>
      </el-form-item>
      <!--企业/单位-->
      <el-form-item prop="organization" label="企业/单位">
        <el-input v-model="form.organization" type="organization" prop="organization" placeholder="请输入企业/单位" class="word" auto-complete="off"></el-input>
      </el-form-item>
      <!--机构验证码-->
      <el-form-item prop="tenantCode" label="机构验证码">
        <el-input v-model="form.tenantCode" type="tenantCode" prop="tenantCode" placeholder="请输入机构验证码" class="word" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
<!--    <div class="tw-w-full tw-h-[46px] tw-flex tw-flex-col">-->
<!--    </div>-->
    <div class="operation">
      <el-button class="login-btn" :loading="loading" @click="handleRegister">注册</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import mixinRegister from '@/layout/components/mixinRegister';

export default {
  name: 'RegisterComp',
  mixins: [mixinRegister],
  methods: {
    goLogin() {
      this.$emit('changeMode', 'login');
    },
    // 注册方法
    handleRegister() {
      this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const res = await axios.post('/api/user/register', {
            ...this.form,
          });
          this.loading = false;
          if (res.data.code === '00000') {
            this.$message({
              type: 'success',
              message: '注册成功',
            });
            this.$emit('changeMode', 'login');
          } else {
            this.$message({
              type: 'error',
              message: res?.data?.msg ? res?.data?.msg : '注册失败',
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
.form-container {
  border-radius: 8px;
  background: #fff;
  padding: 20px 40px 40px;
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

::v-deep {
  .el-input__inner {
    height: 40px!important;
    line-height: 40px!important;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
  }
}
.register-page {
  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>
