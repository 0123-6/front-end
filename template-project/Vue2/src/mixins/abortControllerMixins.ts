import {defineComponent} from "vue";

export default defineComponent({
	data() {
		return {
			// 令牌控制器set
			abortControllerSet: new Set<AbortController>(),
		}
	},
	beforeDestroy() {
		// 取消正在请求的请求
		this.abortControllerSet.forEach(abortController => abortController.abort())
		this.abortControllerSet.clear()
	},
})
