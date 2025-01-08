<template>
	<div class="h-[28px] flex justify-center items-center px-2.5 gap-x-1 rounded-lg border border-[#DEDEDE] bg-[#F6F6F6] text-sm leading-5">
		<span class="text-[#555555]" style="">{{label}}：</span>
		<span v-if="!haveValue"
		      class="text-[#A8ACAD] select-none" style="">全部</span>
		<div v-if="haveValue"
		     class="flex items-center gap-x-1">
			<slot name="content"/>
			<div class="flex justify-center items-center text-[#B5B5B5] cursor-pointer hover:text-main"
			     @click="clearCondition">
				<close-svg/>
			</div>
		</div>
	</div>
</template>

<script>
import CloseSvg from "@/views/policy/components/icon/CloseSvg.vue";

export default {
	name: "SelectedCondition",
	components: {
		CloseSvg
	},
	props: {
		label: {
			type: String,
			required: true,
		},
		haveValue: {
			type: Boolean,
			required: true,
		},
	},
	emits: ['clear-condition'],
	methods: {
		clearCondition() {
			this.$emit('clear-condition')
		},
	},
}
</script>

<style lang="scss">

</style>