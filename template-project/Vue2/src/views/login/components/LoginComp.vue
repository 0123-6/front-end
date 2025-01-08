<template>
	<!--最外层-->
	<div class="w-[440px] h-[564px] rounded-lg bg-white flex flex-col select-none"
	     style="padding: 40px 40px 0;box-shadow: 0 0 7px 0 rgba(27, 44, 80, 0.06);">
		<span class="text-[#1a1a1a] text-[32px] leading-[42px] font-medium">欢迎登录</span>
		<div class="mt-4 flex items-center">
			<span class="text-[#9ca4ab]">没有账号去</span>
			<button class="text-primary"
			        @click="goRegister">注册</button>
		</div>
		<el-form ref="formRef"
		         :model="formModel"
		         :rules="formRules"
		         label-position="top"
		         status-icon
		         class="mt-[42px]"
		>
			<el-form-item prop="phone" label="手机号码">
				<el-input class="w-full" v-model="formModel.phone" placeholder="请输入手机号码"/>
			</el-form-item>
			<el-form-item prop="password" label="密码">
				<el-input show-password class="w-full" v-model="formModel.password" placeholder="请输入密码"/>
			</el-form-item>
		</el-form>
		<div class="flex justify-end items-center">
			<button class="text-[#9ca4ab] leading-[22px] hover:text-primary active:text-primary-active"
			        @click="goReset"
			>重置密码</button>
		</div>
		<ButtonPrimary class="mt-7 h-[50px]"
		               text="登录"
		               :loading="loading"
		               @click.native="login"/>
	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {myFetch} from "@/util/api.ts";
import abortControllerMixins from "@/mixins/abortControllerMixins.ts";
import ButtonPrimary from "@/components/button/ButtonPrimary.vue";
import {formRules} from "@/util/validator.ts";

export default defineComponent({
	name: "LoginComp",
	components: {ButtonPrimary},
	mixins: [
		abortControllerMixins,
	],
	data() {
		return {
			formModel: {
				phone: '',
				password: '',
			},
			formRules: {
				phone: formRules.phone(this),
				password: formRules.password(this),
			},
			loading: false,
		}
	},
	methods: {
		async login() {
			this.loading = true
			const abortController = new AbortController()
			try {
				// 失败会触发catch，因此无需判断 verificationCode
				// @ts-ignore
				await this.$refs.formRef!.validate()

				this.abortControllerSet.add(abortController)
				const data = await myFetch({
					url: '/login',
					method: 'post',
					data: this.formModel,
					signal: abortController.signal,
				})
				if (data === undefined) {
					return
				}
				this.$message({
					type: 'success',
					message: '登录成功',
					showClose: true,
				})
				this.$store.commit('setUser', data.userInfo)
				this.$router.replace('/index')
			} catch (e) {
			} finally {
				this.abortControllerSet.delete(abortController)
				this.loading = false
			}
		},
		goRegister() {
			this.$emit('setMode', 'register')
		},
		goReset() {
			this.$emit('setMode', 'reset')
		},
	},
})
</script>



