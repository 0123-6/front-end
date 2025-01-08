<template>
	<!--最外层-->
	<div class="module-two flex flex-col bg-primary">
		<span class="text-xl">模块2</span>
		<CardComp :id="24" @onOkHaa="onOk">
			<template v-slot:header="slotParams">
				<div class="flex flex-col">
					<span>头部内容</span>
					<span>{{slotParams.username}}</span>
					<span>{{slotParams.age}}</span>
					<span>{{slotParams.love}}</span>
				</div>
			</template>
			<template v-slot:default>
				<div class="flex flex-col">
					<span class="text-purple-700 text-xl">父组件传递进来的默认插槽</span>
				</div>
			</template>
		</CardComp>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import CardComp from "@views/module-two/components/CardComp.vue";


export default defineComponent({
	name: "ModuleTwo",
	components: {CardComp},
	data() {
		return {
			someObject: {},
		}
	},
	mounted() {
		const newObject = {}
		this.someObject = newObject

		// debugger
		console.log(newObject === this.someObject)
	},
	methods: {
		onOk() {
			console.log('hhhhhhhhhh,可以啊')
		},
	},
})
</script>

