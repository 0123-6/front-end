<template>
  <el-dialog v-dialog-drag title="找回密码" width="480px" :modal-append-to-body="false" custom-class="find-password-dialog" visible :before-close="handleClose">
    <!--最外层-->
    <div class="tw-pt-[38px] tw-box-border tw-w-full tw-h-[424px] tw-bg-white tw-flex tw-flex-col">
      <el-form ref="findPasswordForm" :model="form" :rules="rules" class="find-password-form" :inline="true" :close-on-click-modal="false">
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="form.mobile" type="mobile" prop="mobile" placeholder="请输入手机号" class="word" auto-complete="off" style="width: 318px;"></el-input>
        </el-form-item>
        <el-form-item prop="sms_code" label="验证码">
          <el-input v-model="form.sms_code"
                    placeholder="请输入验证码"
                    autocomplete="off"
                    style="width: 318px;"
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
            style="width: 318px;"
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
            style="width: 318px;"
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
      <el-button class="tw-mt-[1px] register-btn tw-ml-[101px]" @click="handleFindPassword">提交</el-button>
      <div class="tw-ml-[101px] tw-mt-[8px] tw-flex tw-items-center tw-text-sm tw-h-[20px] tw-leading-[20px]">
        <span class="tw-text-[#9CA4AB]">已有账号去</span>
        <span class="tw-text-main hover:tw-text-main-hover active:tw-text-main-active tw-cursor-pointer"
              @click="goLogin">登录</span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios';
import mixinFindPassword from "@/layout/components/mixinFindPassword";
import {post} from "@/utils/request";

export default {
  name: 'FindPasswordDialog',
  mixins: [
    mixinFindPassword,
  ],
  methods: {
    // 去登录
    goLogin() {
      this.$emit('goLogin');
    },
    handleClose(done) {
      this.$emit('close');
      done();
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
          this.$emit('goLogin');
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
::v-deep {
  .find-password-dialog {
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
      margin-bottom: 28px;
    }
    .register-btn {
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
