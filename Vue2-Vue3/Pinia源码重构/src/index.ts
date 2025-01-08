import { createApp } from "vue/dist/vue.esm-bundler.js"
import {createPinia} from "./pinia"
import useCounterStore from "./myStore.ts";

const CompOne = {
	template: `<div style="width: 100%;height: 300px;background-color: red;display: flex;flex-direction: column;">
	<span>{{counter.count}}</span>
</div>`,
	setup() {
		const counter = useCounterStore()

		return {
			counter,
		}
	},
}

const CompTwo = {
	template: `<div style="width: 100%;height: 300px;background-color: blue;display: flex;flex-direction: column;">
	<span>{{counter.count}}</span>
	<button @click="add">add</button>
</div>`,
	setup() {
		const counter = useCounterStore()

		function add() {
			debugger
			counter.count++
		}

		return {
			counter,
			add,
		}
	},
}

const app = createApp({
	components: {
		CompOne,
		CompTwo
	},
	template: `<div style="width: 100vw;height: 100vh;background-color: aqua;display: flex;flex-direction: column;">
	<span>layout</span>
	<CompOne/>
	<CompTwo/>
</div>`,
	setup() {
		debugger
		const counter = useCounterStore()
		counter.count++
		counter.$patch({
			count: counter.count + 1,
		})
		counter.increment()

		return {
			counter,
		}
	}
})

debugger
// 创建pinia实例
const pinia = createPinia()
app.use(pinia)

// 将创建的实例绑定到DOM上
app.mount(document.body)
