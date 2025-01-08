<template>
	<!--最外层-->
	<div class="w-full flex flex-col">
		<!--表单-->
		<el-form ref="formRef"
		         :model="formModel"
		         :rules="formRules"
		         label-position="top"
		         status-icon
		>
			<el-form-item prop="phone" label="手机号码">
				<el-input class="w-full" v-model="formModel.phone" placeholder="请输入手机号码"/>
			</el-form-item>
			<el-form-item prop="password" label="密码">
				<el-input show-password class="w-full" v-model="formModel.password" placeholder="请输入密码"/>
			</el-form-item>
		</el-form>
		<!--按钮-->
		<div class="my-4 w-full h-[50px] flex justify-center items-center">
			<button @click="onCancel">取消</button>
			<ButtonPrimary class="ml-4 w-[100px] h-full"
			               text="确定"
			               :loading="loading"
			               @click.native="onOk"/>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {myFetch} from "@/util/api.ts";
import abortControllerMixins from "@/mixins/abortControllerMixins.ts";
import ButtonPrimary from "@/components/button/ButtonPrimary.vue";
import {formRules} from "@/util/validator.ts";

export default defineComponent({
	name: "LoginDialog",
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
		async onOk() {
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
				this.$emit('onOk')
			} catch (e) {
			} finally {
				this.abortControllerSet.delete(abortController)
				this.loading = false
			}
		},
		onCancel() {
			this.$emit('onCancel')
		},
	},
})
</script>
