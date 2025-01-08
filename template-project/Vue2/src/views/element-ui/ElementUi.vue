<template>
	<!--最外层-->
	<div class="element-ui-page flex-grow flex flex-col bg-[orange]">
		<div class="mt-4 flex items-center">
			<button @click="showLoginDialog = true">打开弹框</button>
			<button @click="showLoginDialog2 = true">打开弹框2</button>
		</div>
		<!--弹框区域-->
		<dialog-comp :show.sync="showLoginDialog"
		             title="登录"
		             class="login-dialog"
		>
			<login-dialog @onOk="loginDialogOnOk"
			              @onCancel="showLoginDialog = false"/>
		</dialog-comp>
		<dialog-prompt :show.sync="showLoginDialog2"
		               @onOk="promptDialogOnOk"
		>
			<span class="flex items-center">哈哈哈</span>
		</dialog-prompt>
	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import DialogComp from "@/components/dialog-comp/DialogComp.vue";
import LoginDialog from "@views/element-ui/components/LoginDialog.vue";
import DialogPrompt from "@/components/dialog-comp/DialogPrompt.vue";
import {myFetch} from "@/util/api.ts";
import abortControllerMixins from "@/mixins/abortControllerMixins.ts";

export default defineComponent({
	name: "ElementUi",
	components: {
		DialogPrompt,
		LoginDialog,
		DialogComp,
	},
	mixins: [abortControllerMixins],
	data() {
		return {
			showLoginDialog: false,
			showLoginDialog2: false,
		}
	},
	methods: {
		loginDialogOnOk() {
			this.showLoginDialog = false
		},
		async promptDialogOnOk(callback: () => void) {
			const abortController = new AbortController()
			try {
				this.abortControllerSet.add(abortController)
				const data = await myFetch({
					url: '/login',
					method: 'post',
					data: {
						phone: '17796723651',
						password: 'han1pei62'
					},
					signal: abortController.signal,
				})
				if (data === undefined) {
					return
				}

				this.$message({
					type: 'success',
					message: '登录成功',
				})
				this.showLoginDialog2 = false
			} catch (e) {
			} finally {
				this.abortControllerSet.delete(abortController)
				callback()
			}
		},
	},
})
</script>

<style>
.element-ui-page {

}
</style>
