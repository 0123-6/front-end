<!--
 * @Author: Duan 1304965942@qq.com
 * @Date: 2022-07-27 15:25:52
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 11:31:13
 * @FilePath: \ai-platform-front-end-project\src\views\login\lost-message\message-dialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    v-dialogDrag
    title="提示"
    visible
    :width="'480px'"
    :custom-class="'dialog'"
    style="line-height:30px;font-family: SourceHanSansSC-Bold;font-size: 14px;color: #262626;letter-spacing: 0;font-weight: 700;margin-top:130px"
    :close-on-click-modal="false"
    append-to-body
    :before-close="cancel"
  >
    <div class="flex flex-direction" style="width: 100%;margin-top: -16px;">
      <div class="flex border-bottom" style="width: 100%;" />
      <div class="flex flex-direction" style="width: 100%;">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="142px"
          style="width: 100%;"
          class="margin-top-24"
          label-suffix=":"
          :hide-required-asterisk="true"
        >
          <el-form-item :label="message" label-class-name="label-user" prop="ownMessage" style="width: 373px;">
            <label slot="label" style="font-weight: 400;">{{ message }}</label>
            <el-input v-model="form.ownMessage" :placeholder="'请输入'+message" prop="ownMessage" />
          </el-form-item>
          <el-form-item prop="code" style="width: 285px; display:inline-block ">
            <label slot="label" style="font-weight: 400;">验证码</label>
            <el-input v-model="form.code" placeholder="请输入验证码" prop="code" />
          </el-form-item>
          <el-button v-if="isSend" class="send-code" @click="sendMessage">发送验证码</el-button>
          <el-button v-if="!isSend" class="send-code" style="background-color:white;cursor:default;">{{ sendMsg }}</el-button>
          <el-form-item prop="message" style="width: 373px; display:inline-block ">
            <label slot="label" style="font-weight: 400; ">请输入密码</label>
            <el-input v-model="form.message" type="password" placeholder="请输入密码" prop="message" />
          </el-form-item>
          <el-form-item prop="messageAgain" style="width: 373px; display:inline-block ">
            <label slot="label" style="font-weight: 400;">确认密码</label>
            <el-input v-model="form.messageAgain" type="password" placeholder="请输入确认密码" prop="messageAgain" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="white-btn" @click="cancel">取 消</el-button>
        <el-button class="blue-btn" @click="ok">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'MessageDialog',
  props: {
    message: {
      type: String,
      default: ''
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入设置密码'));
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,30}$/.test(value)) {
        callback(new Error('密码需为6-30位字母、数字的组合'));
      } else {
        if (this.form.messageAgain !== '') {
          this.$refs.form.validateField('messageAgain');
        }
        callback();
      }
    };
    const validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入设置密码'));
      } else if (value !== this.form.message) {
        callback(new Error('两次输入密码不一致!'));
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,30}$/.test(value)) {
        callback(new Error('密码需为6-30位字母、数字的组合'));
      } else {
        callback();
      }
    };
    const checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!value) {
        return callback(new Error('电话号码不能为空'));
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,但是实际用的时候输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换

        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'));
        } else {
          if (phoneReg.test(value)) {
            callback();
          } else {
            callback(new Error('电话号码格式不正确'));
          }
        }
      }, 100);
    };
    const checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        return callback(new Error('邮箱不能为空'));
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error('请输入正确的邮箱格式'));
        }
      }, 100);
    };
    return {
      form: {
        ownMessage: '',
        code: '',
        message: '',
        messageAgain: ''
      },
      sendMsg: '发送验证码',
      isSend: true,
      formData: {},
      rules: {
        ownMessage: [
          {
            required: true,
            message: this.message === '手机号' ? '手机号不能为空' : '邮箱不能为空',
            change: 'blur'
          },
          {
            validator: this.message === '手机号' ? checkPhone : checkEmail,
            message: this.message === '手机号' ? '请输入正确的手机号' : '请输入正确的邮箱地址',
            trigger: ['blur']
          }
        ],
        code: [
          {
            required: true,
            message: '当前验证码不能为空',
            change: 'blur'
          }
        ],
        message: [
          { validator: validatePass, trigger: 'blur', required: true }
        ],
        messageAgain: [
          { validator: validateCheckPass, trigger: 'blur', required: true }
        ]
      }
    };
  },
  methods: {
    ok() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('ok', this.form);
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.$emit('cancel');
    },
    sendMessage() {
      this.$emit('sendMessage', this.form.ownMessage);
      this.isSend = false;
      let timer = 60;
      this.sendMsg = timer + 's';
      this.timeFun = setInterval(() => {
        --timer;
        this.sendMsg = timer + 's';
        if (timer === 0) {
          this.isSend = true;
          this.sendMsg = '重新发送';
          clearInterval(this.timeFun);
        }
      }, 1000);
    }
  }

};
</script>

<style lang="scss" scoped>
  ::v-deep {
  .dialog {
    border-radius: 4px;
    .el-dialog__header {
      height: 45px;
      line-height: 45px;
      padding: 0 24px;
      .el-dialog__title {
        font-size: 14px;
      }
    }
    .dialog-footer {
      margin-bottom: 20px;
    }
  }
}

  .send-code{
    display: inline-block;
    width: 83px;
    left: 5px;
    background-color: white;
    color: #0164FF;
    margin-left: 5px;
    padding: 10px 5px;
    border-radius: 5px;
  }

  .send-code:hover{
    background-color: #d7ecff;
  }

  .send-code::before{
    width: 20px;
  }

  .label-user{
    font-weight: 400;
  }
::v-deep{
  .el-form-item__label {
    font-weight: 400;
  }
}
</style>
