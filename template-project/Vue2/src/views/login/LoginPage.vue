<template>
	<!--最外层-->
	<div class="login-page flex-grow flex justify-around items-center"
	     style="background-image: url('/login/bg.png');background-size: auto 100%;">
		<!--左上角-->
		<div class="absolute left-[100px] top-[50px] flex items-center">
			<img src="/login/favicon.svg" alt="" class="w-[37px] h-[37px]" draggable="false">
			<span class="ml-1 text-lg font-bold">韩佩江测试网站</span>
		</div>
		<!--左-->
		<img src="/login/bg-content.png"
		     alt=""
		     draggable="false"
		     class="w-1/2 max-w-[731px]">
		<!--右-->
		<!--登录组件-->
		<LoginComp v-if="mode === 'login'"
		           :key="mode"
		           @setMode="setMode"/>
		<!--注册组件-->
		<RegisterAndResetComp v-else-if="mode === 'register'"
		                      :key="mode"
		                      :mode="mode"
		                      @setMode="setMode"/>
		<!--忘记密码组件-->
		<RegisterAndResetComp v-else-if="mode === 'reset'"
		                      :key="mode"
		                      :mode="mode"
		                      @setMode="setMode"/>
		<!--下面备案号-->
		<div class="absolute bottom-4 p-4 mx-auto flex items-center">
			<a class="text-[#646464] cursor-pointer hover:text-primary" href="https://beian.miit.gov.cn/" target="_blank">待申请备案号</a>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import LoginComp from "@views/login/components/LoginComp.vue";
import RegisterAndResetComp from "@views/login/components/RegisterAndResetComp.vue";
import abortControllerMixins from "@/mixins/abortControllerMixins.ts";

export default defineComponent({
	name: "LoginPage",
	mixins: [
		abortControllerMixins,
	],
	components: {
		RegisterAndResetComp,
		LoginComp,
	},
	data() {
		return {
			// 登录login, 注册register, 重置密码reset
			mode: 'login',
		}
	},
	methods: {
		setMode(newMode: string) {
			this.mode = newMode
		}
	},
})
</script>

<style>
.login-page {
	.el-form-item {
		margin-bottom: 28px;
		.el-form-item__label {
			font-size: 16px;
			line-height: 22px;
			padding-bottom: 8px;
			color: #1a262c;
		}
		.el-input__inner {
			height: 48px;
		}
	}
}
</style>
