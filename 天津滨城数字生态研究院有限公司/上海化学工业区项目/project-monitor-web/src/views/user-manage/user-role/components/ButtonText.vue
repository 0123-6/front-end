<template>
	<div class="flex items-center"
	     :class="[
				 color === 'main' && !disabled ? 'text-main hover:text-main-hover active:text-main-active' : '',
				 color === 'red' && !disabled ? 'text-red' : '',
				 !disabled ? 'cursor-pointer' : 'text-[#A8ACAD] cursor-not-allowed',
	     ]">
		<slot></slot>
	</div>
</template>

<script>

export default {
	name: "ButtonText",
	props: {
		color: {
			type: String,
			required: false,
			default: 'main',
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	methods: {
	},
}
</script>

<style lang="scss">

</style>