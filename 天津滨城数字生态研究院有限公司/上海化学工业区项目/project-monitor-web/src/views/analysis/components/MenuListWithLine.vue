<template>
	<div class="w-full bg-white overflow-visible flex flex-col">
		<!--文字-->
		<div class="flex items-center gap-x-8">
			<div v-for="(item, index) in list"
			     :key="index"
			     class="h-[40px] pt-5 flex flex-col items-center cursor-pointer relative overflow-visible flex-shrink-0"
			     :class="[
							 type === item.name ? 'text-main font-medium' : 'text-black-three',
				     ]"
			     style=""
			     @click="type = item.name"
			>
				<span class="flex-shrink-0 text-sm leading-5 select-none">{{ item.name }}({{ item.value }})</span>
				<div v-if="type === item.name"
				     class="flex-shrink-0 mt-[7.5px] h-[2px] bg-main w-full"></div>
			</div>
		</div>
		<!--横线-->
		<div class="mt-2 h-[1px] bg-black-line"></div>
	</div>
</template>

<script>
export default {
	name: "MenuListWithLine",
	props: {
		list: {
			type: Array,
			required: true,
		},
		projectType: {
			type: String,
			required: true,
		},
	},
	computed: {
		type: {
			get() {
				return this.projectType
			},
			set(val) {
				this.$emit('update:projectType', val);
			},
		},
	}
}
</script>

<style lang="scss">

</style>