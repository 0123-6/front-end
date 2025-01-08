// mixinRegister
import { mapGetters } from 'vuex';
import axios from 'axios';
import {post} from "@/utils/request";

export default {
  data() {
    return {
      // 表单
      form: {
        mobile: '',
        sms_code: '',
        password: '',
        // 确认密码
        password2: '',
      },
      // 表单验证规则
      rules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机格式不正确', }
        ],
        sms_code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          // 只能是数字，长度为4
          { pattern: /^\d{4}$/, message: '验证码格式不正确', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur',
          },
        ],
        password2: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur',
          },
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
      },
      // 是否发送验证码
      isSend: false,
      loading: false,
      beforeSecondSend: 60,
      // 定时器
      timer: null,
      phoneOk: false,
      // 发送验证码的手机号
      sendPhone: '',
      showPassword: false,
      showPassword2: false,
    };
  },
  watch: {
    // 监听form.userPhoneNumber的变化,如果满足手机号格式,则设置phoneOk为true，可以发送验证码
    form: {
      handler(val) {
        this.phoneOk = /^1[3456789]\d{9}$/.test(val.mobile);
        console.log('this.phoneOk: ', this.phoneOk);
      },
      deep: true,
    },
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
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  methods: {
    // 发送验证码
    async sendVerificationCode(_e) {
      if (!(this.phoneOk && !this.isSend)) {
        return;
      }
      console.log('into sendVerificationCode');
      _e.stopPropagation();
      _e.preventDefault();
      // 校验手机号是否正确,正确则获取手机号
      const params = {
        mobile: this.form.mobile,
      };
      // 发送验证码
      await post('/user/sms/forgot_pwd', params);
      this.sendPhone = this.form.mobile;
      this.isSend = true;
      this.timer = setInterval(() => {
        this.beforeSecondSend -= 1;
        if (this.beforeSecondSend <= 0) {
          clearInterval(this.timer);
          this.timer = null;
          this.isSend = false;
          this.beforeSecondSend = 60;
        }
      }, 1000);
    },
  },
};
