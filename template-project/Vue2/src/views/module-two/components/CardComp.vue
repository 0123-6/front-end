<template>
	<div class="w-[400px] h-[400px] flex flex-col bg-red border border-amber-400">
		<div class="w-full h-[200px] shrink-0 bg-blue-700 flex justify-center items-center">
			<span class="text-xl">子组件内部内容,id={{id}}</span>
		</div>
		<slot name="header" :username="name" :age="age" :love="love">
			<div class="flex flex-col">
				<span>默认头部插槽</span>
			</div>
		</slot>
		<slot name="default">
			<div class="flex flex-col">
				<span>这是默认插槽</span>
			</div>
		</slot>
		<slot name="footer">
			<div class="flex flex-col" @click="clickFoot">
				<span>默认尾部插槽</span>
			</div>
		</slot>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
	name: "CardComp",
	props: {
		id: {
			type: Number,
			required: true,
		}
	},
	data() {
		return {
			name: '',
			age: 0,
			love: 0,
		}
	},
	created() {
		this.getInfo()
	},
	methods: {
		getInfo() {
			setTimeout(() => {
				this.name = '夏翀'
				this.age = 25
				this.love = 9.2
			}, 2000)
		},
		clickFoot() {
			this.$emit('onOkHaa')
		},
	}
})
</script>
