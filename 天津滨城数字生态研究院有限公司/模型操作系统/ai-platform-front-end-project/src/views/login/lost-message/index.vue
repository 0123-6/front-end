<template>
  <!--最外层-->
  <div
    class="flex flex-direction bgc-main my-1"
    style="width: 100%; height: 100%"
  >
    <!--主体-->
    <div class="main id123">
      <div class="title">
        <div class="word">找回密码</div>
        <div class="return">
          <div
            class="flex bgc-white justify-center align-center hand"
            style="width: 54px; height: 24px; margin-right: 20px"
            @click="goHome"
          >
            <el-button class="return-btn" icon="el-icon-caret-left">返回</el-button>
          </div>
        </div>
      </div>

      <!--步骤条-->
      <div style="width: 100%;" class="flex justify-center margin-top-24">
        <AiSteps :active="active" :steps="milepost"></AiSteps>
      </div>

      <div class="concrete">
        <div v-if="active === 0">
          <span
            style="
              font-family: SourceHanSansSC-Regular;
              font-size: 14px;
              color: #646464;
              letter-spacing: 0;
              text-align: right;
              line-height: 16px;
              font-weight: 400;
            "
          >账号：
          </span>
          <el-input v-model="id" class="username" prop="username" />
        </div>
        <div v-else-if="active === 1">
          <div
            class="check-box"
            @click="
              showDialog = true;
              matain = true;
            "
          >
            <img
              class="email"
              src="@/assets/images/login/lost-message/邮箱.svg"
              alt=""
            >
            <div class="email-word">邮箱验证</div>
          </div>
          <div
            class="check-box short-message"
            @click="
              showDialog = true;
              matain = false;
            "
          >
            <img
              class="email"
              src="@/assets/images/login/lost-message/mail-fill.svg"
              alt=""
            >
            <div class="email-word">
              <div class="short-message-word">短信验证</div>
              <div class="you-should">你需要用密保手机进行短信验证</div>
            </div>
          </div>
          <div style="color: #b7b7b7; font-size: 14px; line-height: 50px">
            若以上方式均不可用，请联系超级管理员验证账号，联系电话：xxxx
          </div>
        </div>
        <div v-else-if="active === 2">
          <i class="el-icon-success" />
          <div
            style="margin-top:10px; font-family: SourceHanSansSC-Medium;font-size: 18px;color: #646464;letter-spacing: 0;line-height: 60px;font-weight: 500;"
          >
            密码重置成功
          </div>
        </div>
      </div>

      <el-button
        v-show="active === 0"
        :disabled="id === ''"
        type="primary"
        class="next"
        style=" width:80px; height:35px; text-align:center; margin: 25px 46% auto; border-radius:4px"
        @click="next"
      >下一步
      </el-button>
    </div>
    <!-- 弹窗 -->
    <dialog-ok
      v-if="showDialog"
      :message="matain === true ? '邮箱' : '手机号'"
      @ok="ok"
      @cancel="cancel"
      @sendMessage="sendMessage"
    />
  </div>
</template>

<script>
import DialogOk from './message-dialog.vue';
import { forgetPwdEmail, forgetPwdPhone, sendEmailCode, sendPhoneCode, userValid } from '@/api/user';
import AiSteps from "@/components/AiSteps";

export default {
  name: 'LostMessage',
  components: {
    AiSteps,
    DialogOk
  },
  data() {
    return {
      message: '',
      matain: false,
      step: 0,
      id: '',
      showDialog: false,
      milepost: ['填写账号','身份验证','完成'],
      // 默认步骤数
      active: 0,
      // 动态添加类名
      stepActive: 'stepActive'
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    goHome() {
      this.$router.back();
    },
    returnHome() {
      this.$router.push('/');
    },
    next() {
      userValid({ userName: this.id }).then(res => {
        if (res.code === '000000') {
          this.active++;
        }
      });
    },
    ok(data) {
      const { ownMessage, code, message, messageAgain } = data;
      if (this.matain) {
        const params = {
          email: ownMessage,
          code: code,
          newPassword: message,
          chPassword: messageAgain,
          userName: this.id
        };
        forgetPwdEmail(params).then(res => {
          if (res.code === '000000') {
            this.cancel();
            this.next();
            setTimeout(() => {
              this.$router.push('/login');
            }, 1000);
          }
        });
      } else {
        const params = {
          phonenumber: ownMessage,
          code: code,
          newPassword: message,
          chPassword: messageAgain,
          userName: this.id
        };
        forgetPwdPhone(params).then(res => {
          if (res.code === '000000') {
            this.cancel();
            this.next();
            setTimeout(() => {
              this.$router.push('/login');
            }, 1000);
          }
        });
      }
    },
    cancel() {
      this.showDialog = false;
    },
    sendMessage(msg) {
      if (this.matain) {
        const params = {
          email: msg,
          userName: this.id
        };
        sendEmailCode(params).then(res => {
          if (res.code === '000000') {
            this.$message.success('验证码已发送');
          }
        });
      } else {
        const params = {
          phonenumber: msg,
          userName: this.id
        };
        sendPhoneCode(params).then(res => {
          if (res.code === '000000') {
            this.$message.success('验证码已发送');
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 70%;
  height: 100%;
  background-color: white;
  margin: 20px auto;
}

.title {
  height: 50px;
  width: 88%;
  border-bottom: 1px solid #eeeeee;
  display: inline-block;
  margin: auto auto auto 5%;
}

.title .word {
  width: 64px;
  height: 16px;
  font-family: SourceHanSansSC-Medium;
  font-size: 16px;
  color: #232323;
  letter-spacing: 0;
  line-height: 55px;
  font-weight: 500;
}

.main .return {
  position: absolute;
  right: 15%;
}

.concrete {
  margin: 0 auto;
  text-align: center;
}

.username {
  margin-top: 80px;
  margin-left: 10px;
  width: 320px;
  height: 40px;
}

::v-deep .concrete .el-input__inner{
    width: 320px;
    height: 40px !important;
}

.check-box {
  margin-left: 50%;
  margin-top: 20px;
  margin-bottom: 20px;
  transform: translate(-50%);
  width: 38%;
  height: 56px;
  background-color: white;
  box-shadow: 0 2px 13px 0 rgba(194, 194, 194, 0.5);
  border-radius: 2px;
}

.email {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translate(0, -50%);
}

.email-word {
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translate(0, -50%);
  font-size: 14px;
  font-family: SourceHanSansSC-Regular;
  color: #646464;
  letter-spacing: 0;
  font-weight: 400;
}

.short-message-word {
  text-align: left;
  left: 0;
  font-size: 14px;
}

.check-box:hover {
  background-color: #f5f7fa;
  cursor: pointer;
}

.you-should {
  margin-top: 5px;
  font-size: 12px;
  font-family: SourceHanSansSC-Normal;
  color: #b7b7b7;
}
.el-icon-success {
  margin-top: 50px;
  font-size: 70px;
  fill: #00AB5A;
  color: #00AB5A;
}
</style>

<style scoped>

.id123 >>> label {
  font-weight: 400;
}

.id123 >>> .el-input__inner {
  height: 24px;
}

.id123 >>> .el-input--medium .el-input__icon {
  line-height: 24px;
}

</style>
