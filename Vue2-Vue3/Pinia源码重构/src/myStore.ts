import {ref} from "vue";
import {defineStore} from "./pinia";

debugger
// 为什么命名为useXXX?因为defineStore函数返回的是一个组合式函数
const useCounterStore = defineStore('counter', () => {
	// state
	const count = ref(0)

	// methods
	function increment() {
		console.dir(increment)
		debugger
		count.value++
	}

	return {
		count,
		increment,
	}
})

export default useCounterStore
