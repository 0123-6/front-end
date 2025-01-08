<template>
  <!--最外层-->
  <div class="form-container find-password-page">
    <div class="welcome">找回密码</div>
    <div class="tw-mb-[24px] tw-w-full tw-flex tw-items-center tw-text-sm">
      <span class="tw-text-[#9CA4AB] tw-leading-5">已有账号去</span>
      <span class="tw-text-main tw-leading-5 tw-cursor-pointer"
            @click="goLogin">登录</span>
    </div>
    <el-form ref="findPasswordForm" :model="form" :rules="rules" class="login-form">
      <el-form-item prop="mobile" label="手机号">
        <el-input v-model="form.mobile" type="mobile" prop="mobile" placeholder="请输入手机号" class="word" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="sms_code" label="验证码">
        <el-input v-model="form.sms_code"
                  placeholder="请输入验证码"
                  autocomplete="off"
                  class="word">
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
                    :class="[(phoneOk) ? 'tw-text-white' : ('tw-text-[#B8BABF]')]">{{(sendPhone && form.mobile === sendPhone) ? '重新发送' : '获取验证码'}}</span>
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
      <!--确认密码-->
      <el-form-item prop="password2" label="确认密码">
        <el-input
          prop="password2"
          v-model="form.password2"
          :type="showPassword2 ? 'text' : 'password'"
          placeholder="请再次输入登录密码"
          autocomplete="off"
          auto-complete="off"
          class="word"
        >
          <div
            class="tw-mr-2 tw-h-full tw-flex tw-justify-center tw-items-center tw-cursor-pointer"
            slot="suffix"
            @click="showPassword2 = !showPassword2"
          >
            <img v-show="!showPassword2" src="../icon/HidePasswordSvg.svg" alt="" style="width: 18px; height: 18px" />
            <img v-show="showPassword2" src="../icon/ShowPasswordSvg.svg" alt="" style="width: 18px; height: 18px" />
          </div>
        </el-input>
      </el-form-item>
    </el-form>
    <!--    <div class="tw-w-full tw-h-[46px] tw-flex tw-flex-col">-->
    <!--    </div>-->
    <div class="operation">
      <el-button class="login-btn" @click="handleFindPassword">提交</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import mixinFindPassword from "@/layout/components/mixinFindPassword";
import {post} from "@/utils/request";

export default {
  name: 'FindPasswordComp',
  mixins: [mixinFindPassword],
  methods: {
    goLogin() {
      this.$emit('changeMode', 'login');
    },
    // 找回密码方法
    handleFindPassword() {
      this.$refs.findPasswordForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const res = await post('/user/forgot-pwd', this.form);
          console.log('res: ', res);
          this.loading = false;
          this.$message({
            type: 'success',
            message: '重置密码成功',
          });
          this.$emit('changeMode', 'login');
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
.find-password-page {
  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>
