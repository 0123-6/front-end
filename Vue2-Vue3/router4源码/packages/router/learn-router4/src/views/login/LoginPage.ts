import {ref} from "vue/dist/vue.esm-browser.js";
import {useRouter} from '../../../../dist/vue-router.esm-browser.js'

export default {
	name: 'LoginPage',
	template: `<div style="width: 100vw;height: 100vh;display: flex;flex-direction: column;justify-content: center;align-items: center;background-color: red;">
		<div style="width: 600px;height: 600px;display: flex;flex-direction: column;gap: 20px;">
			<span>登录页面</span>
			<div style="display: flex;align-items: center;">
				<span>账户: </span>
				<input type="text" v-model="username" autocomplete="off">
			</div>
			<div style="display: flex;align-items: center;">
				<span>密码: </span>
				<input type="password" v-model="password" autocomplete="off">
			</div>
			<button @click="login"></button>
		</div>
</div>`,
	setup() {
		const username = ref('')
		const password = ref('')

		function login() {
			if (password.value !== 'password') {
				alert('密码错误')
				return
			}
			alert('登录成功')
			const router = useRouter()
			router.replace('/index')
		}

		return {
			username,
			password,
			login,
		}
	}
}
