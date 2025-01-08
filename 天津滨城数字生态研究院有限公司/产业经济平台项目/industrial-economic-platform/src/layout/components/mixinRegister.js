// mixinRegister
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        nickname: '',
        userPhoneNumber: '',
        code: '',
        password: '',
        organization: '',
        tenantCode: '',
      },
      rules: {
        // 姓名
        nickname: [
          { required: true, message: '请输入姓名', trigger: 'blur', },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
        userPhoneNumber: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机格式不正确', }
        ],
        code: [
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
        organization: [
          { required: false, message: '请输入企业/单位', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur',
          },
        ],
        tenantCode: [{ required: false, message: '请输入机构验证码', trigger: 'blur' }],
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
    };
  },
  watch: {
    // 监听form.userPhoneNumber的变化,如果满足手机号格式,则设置phoneOk为true，可以发送验证码
    form: {
      handler(val) {
        this.phoneOk = /^1[3456789]\d{9}$/.test(val.userPhoneNumber);
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
        userPhone: this.form.userPhoneNumber,
      };
      // 发送验证码
      const res = await axios.get('/api/user/code', {
        params,
      });
      if (res.data.code !== '00000') {
        this.$message({
          type: 'error',
          message: res.data?.msg,
        });
        return;
      }
      this.sendPhone = this.form.userPhoneNumber;
      console.log('res: ', res);
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
