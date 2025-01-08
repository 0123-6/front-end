<template>
	<!--最外层-->
	<div class="w-[440px] h-[680px] rounded-lg bg-white flex flex-col select-none"
	     style="padding: 40px 40px 0;box-shadow: 0 0 7px 0 rgba(27, 44, 80, 0.06);">
		<span class="text-[#1a1a1a] text-[32px] leading-[42px] font-medium">{{mode === 'register' ? '欢迎注册' : '重置密码'}}</span>
		<div class="mt-4 flex items-center">
			<span class="text-[#9ca4ab]">已有账号去</span>
			<button class="text-primary"
			        @click="goLogin"
			>登录</button>
		</div>
		<el-form ref="formRef"
		         :model="formModel"
		         :rules="formRules"
		         label-position="top"
		         status-icon
		         class="mt-[42px]"
		>
			<!--手机号码-->
			<el-form-item prop="phone" label="手机号码">
				<el-input class="w-full" v-model="formModel.phone" placeholder="请输入手机号码"/>
			</el-form-item>
			<!--验证码-->
			<el-form-item prop="verificationCode" label="验证码">
				<div class="w-full flex items-center relative">
					<el-input class="w-full" v-model="formModel.verificationCode" placeholder="请输入验证码"/>
<!--			class		2种情况，可以点击，不可以点击
可以点击 手机号码验证成功 && 不是发送中 && 不是倒计时中
不可以点击

文字展示 2种情况 发送验证码 倒计时
发送验证码 不是倒计时
倒计时
-->
					<button class="absolute right-8 rounded-sm my-auto w-[90px] h-[25px] text-sm"
					        :class="[
										(isPhoneOk && !sendVerificationCoding && this.hasInternal === 0) ? 'bg-primary hover:bg-primary-hover active:bg-primary-active' : 'bg-[#cccccc]',
										(hasInternal === 0) ? 'text-white' : 'text-primary',
									]"
					        :disabled="!(isPhoneOk && !sendVerificationCoding && this.hasInternal === 0)"
					        @click="sendVerificationCode"
					>{{hasInternal === 0 ? '获取验证码' : hasInternal + 's'}}</button>
				</div>
			</el-form-item>
			<!--密码-->
			<el-form-item prop="password" label="密码">
				<el-input show-password class="w-full" v-model="formModel.password" placeholder="只能包含数字，字母，下划线，8-16位"/>
			</el-form-item>
			<!--确认密码-->
			<el-form-item prop="password2" label="确认密码">
				<el-input show-password class="w-full" v-model="formModel.password2" placeholder="只能包含数字，字母，下划线，8-16位"/>
			</el-form-item>
		</el-form>
		<ButtonPrimary class="h-[50px]"
		               :text="mode === 'register' ? '注册' : '重置密码'"
		               :loading="sending"
		               @click.native="clickButton"/>
	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {myFetch} from "@/util/api.ts";
import {formRules, isPhoneRegExp} from "@/util/validator.ts";
import abortControllerMixins from "@/mixins/abortControllerMixins.ts";
import ButtonPrimary from "@/components/button/ButtonPrimary.vue";

export default defineComponent({
	name: "RegisterAndResetComp",
	components: {ButtonPrimary},
	mixins: [
		abortControllerMixins,
	],
	props: {
		mode: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			// 表单数据
			formModel: {
				phone: '',
				verificationCode: '',
				password: '',
				password2: '',
			},
			formRules: {
				phone: formRules.phone(this),
				verificationCode: formRules.verificationCode(this),
				password: formRules.password(this),
				password2: formRules.password2(this),
			},
			sending: false,

			// 验证码相关
			// 手机号码验证成功
			isPhoneOk: false,
			// 发送中
			sendVerificationCoding: false,
			// 剩余再次发送时间
			hasInternal: 0,
			// 默认发送间隔
			sendInternal: 60,
			// 剩余时间定时器
			timer: null as NodeJS.Timeout | null,
		}
	},
	watch: {
		'formModel.phone': function (newVal) {
			this.isPhoneOk = isPhoneRegExp.test(newVal)
		},
	},
	beforeDestroy() {
		if (this.timer) {
			clearInterval(this.timer)
			this.timer = null
		}
	},
	methods: {
		clickButton() {
			if (this.mode === 'register') {
				this.register()
			} else if (this.mode === 'reset') {
				this.reset()
			}
		},
		async register() {
			this.sending = true
			const abortController = new AbortController()
			try {
				// 失败会触发catch，因此无需判断
				// @ts-ignore
				await this.$refs.formRef!.validate()
				this.abortControllerSet.add(abortController)
				const data = await myFetch({
					url: '/register',
					method: 'post',
					data: this.formModel,
					signal: abortController.signal,
				})
				if (data === undefined) {
					return
				}
				this.$message({
					type: 'success',
					message: '注册成功',
					showClose: true,
				})
			} catch (e) {
			} finally {
				this.abortControllerSet.delete(abortController)
				this.sending = false
			}
		},
		async sendVerificationCode(e: Event) {
			e.stopPropagation()
			e.preventDefault()

			this.sendVerificationCoding = true
			const abortController = new AbortController()
			try {
				this.abortControllerSet.add(abortController)
				const data = await myFetch({
					url: '/sendVerificationCode',
					method: 'post',
					data: {
						phone: this.formModel.phone,
						mode: this.mode,
					},
					signal: abortController.signal,
				})
				if (data === undefined) {
					return
				}
				this.$message({
					type: 'success',
					message: '验证码已发送',
					showClose: true,
				})
				this.hasInternal = 60
				this.timer = setInterval(() => {
					this.hasInternal--
					if (this.hasInternal === 0) {
						clearInterval(this.timer!)
						this.timer = null
					}
				}, 1000)
			} catch (e) {
			} finally {
				this.abortControllerSet.delete(abortController)
				this.sendVerificationCoding = false
			}
		},
		goLogin() {
			this.$emit('setMode', 'login')
		},
		async reset() {
			this.sending = true
			const abortController = new AbortController()
			try {
				// 失败会触发catch，因此无需判断
				// @ts-ignore
				await this.$refs.formRef!.validate()
				this.abortControllerSet.add(abortController)
				const data = await myFetch({
					url: '/reset',
					method: 'post',
					data: this.formModel,
					signal: abortController.signal,
				})
				if (data === undefined) {
					return
				}
				this.$message({
					type: 'success',
					message: '重置密码成功',
					showClose: true,
				})
			} catch (e) {
			} finally {
				this.abortControllerSet.delete(abortController)
				this.sending = false
			}
		},
	},
})
</script>

