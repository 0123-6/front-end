// 手机号码
export const isPhoneRegExp = /^1[3-9]\d{9}$/

// 电子邮箱
export const isEmailRegExp = /^[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}$/

// 验证码
export const isVerificationCodeRegExp = /^\d{4}$/

// 密码，只能包含数字，字母，下划线，8-16位
export const isPasswordRegExp = /^\w{8,16}$/

// 表单校验规则
export const formRules = {
	phone: (_this) => [
		{required: true, trigger: 'change', message: '请输入手机号码',},
		{pattern: isPhoneRegExp, trigger: 'change', message: '手机号码格式不正确',},
	],
	verificationCode: (_this) => [
		{required: true, trigger: 'change', message: '请输入验证码',},
		{pattern: isVerificationCodeRegExp, trigger: 'change', message: '验证码格式不正确',},
	],
	password: (_this) => [
		{required: true, trigger: 'change', message: '请输入密码',},
		{pattern: isPasswordRegExp, trigger: 'change', message: '只能包含数字，字母，下划线，8-16位'},
		{
			validator: (_rule, _value, callback) => {
				// @ts-ignore
				console.log(_rule)
				console.log(_value)
				console.log('_this: ', _this)
				_this.$refs.formRef!.validateField('password2')
				callback()
			},
			trigger: 'change',
		}
	],
	password2: (_this) => [
		{required: true, trigger: 'change', message: '请输入确认密码',},
		{pattern: isPasswordRegExp, trigger: 'change', message: '只能包含数字，字母，下划线，8-16位'},
		{
			validator: (_rule, _value, callback) => {
				// @ts-ignore
				if (_this.formModel.password2 !== _this.formModel.password) {
					callback(new Error('两次密码不一致'))
				} else {
					callback()
				}
			},
			trigger: 'change',
		},
	],
}