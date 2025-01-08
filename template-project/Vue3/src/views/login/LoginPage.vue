<template>
	<!--最外层-->
	<div class="w-full h-full flex flex-col bg-amber-600">
		<span class="text-3xl">登录页面</span>
		<input type="text" v-model="username">
		<input type="password" v-model="password">
		<button @click="login">登录</button>
	</div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useUserStore} from "@/plugin/pinia.ts";
// state
const router = useRouter()
const username = ref('')
const password = ref('')
// methods
function login() {
	if (username.value && password.value === 'password') {
		const {user} = useUserStore()
		user.value = {
			username: username.value,
			password: password.value,
		}
		router.push('/index')
	}
}
</script>
