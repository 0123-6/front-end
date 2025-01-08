<template>
  <el-dialog class="ForgetPwd" v-model="dialogVisible" title="忘记密码" width="557px" :draggable="true"
    :close-on-click-modal="false" align-center append-to-body @close="$emit('close')">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="绑定的手机号:" prop="mobile">
        <el-input class="full-w" v-model="form.mobile" placeholder="请输入绑定的手机号" />
      </el-form-item>
      <el-form-item label="验证码:" prop="code">
        <div class="d-flex ai-center full-w">
          <el-input class="flex-1" v-model="form.code" placeholder="请输入验证码" />
          <el-button class="ml8" type="primary" plain :disabled="!validMobile(form.mobile) || second > 0"
            @click="handleCode">{{ second > 0 ? `${second}s` : '获取验证码' }}</el-button>
        </div>
      </el-form-item>
      <el-form-item label="新密码:" prop="newPwd">
        <el-input class="full-w" v-model="form.newPwd" placeholder="数字/字母/特殊符号任意两种组合，最少6位，最多18位"
          @input="handleInputPwd" />
      </el-form-item>
      <el-form-item label="确认新密码:" prop="confirmPwd">
        <el-input class="full-w" v-model="form.confirmPwd" placeholder="请输入新密码" />
      </el-form-item>
      <div class="d-flex ai-center jc-end">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { validMobile, validPassword } from '@/utils/validate.js'

let newPwd = ''

export default {
  name: 'ForgetPwd',
  components: {},
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  data() {
    const validateMobile = (rule, value, callback) => {
      if (value && !validMobile(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value && !validPassword(value)) {
        callback(new Error('数字/字母/特殊符号任意两种组合，最少6位，最多18位'))
      } else {
        callback()
      }
    }
    const validateConfirmPwd = (rule, value, callback) => {
      if (value && !validPassword(value)) {
        callback(new Error('数字/字母/特殊符号任意两种组合，最少6位，最多18位'))
      } else if (value && value != newPwd) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: true,
      second: 0,
      form: {
        timeType: '1'
      },
      rules: {
        mobile: [
          { required: true, message: '请输入' },
          { validator: validateMobile, trigger: 'blur' },
        ],
        code: [{ required: true, message: '请输入' }],
        newPwd: [
          { required: true, message: '请输入' },
          { validator: validatePassword, trigger: 'blur' },
        ],
        confirmPwd: [
          { required: true, message: '请输入' },
          { validator: validateConfirmPwd, trigger: 'blur' },
        ],
      }
    }
  },
  created() {
  },
  unmounted() {
    this.countInterval && clearInterval(this.countInterval)
  },
  methods: {
    validMobile,
    handleInputPwd(val) {
      newPwd = val
    },
    handleCode() {
      this.second = 60
      this.countInterval && clearInterval(this.countInterval)
      this.countInterval = setInterval(() => {
        this.second -= 1
      }, 1000)
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$message({
            type: 'success',
            message: '修改密码成功'
          })
          this.$emit('close')
        }
      })
    },
  }
};
</script>
