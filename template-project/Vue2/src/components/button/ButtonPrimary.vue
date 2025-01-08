<template>
	<button class="text-white rounded-[6px] flex justify-center items-center"
	        :class="[!loading ? 'bg-primary hover:bg-primary-hover active:bg-primary-active' : 'bg-primary-hover']"
	        :disabled="loading">
		<span>{{text}}</span>
		<i v-if="loading" class="ml-1 el-icon-loading"/>
	</button>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
	name: "ButtonPrimary",
	props: {
		text: {
			type: String,
			required: true,
		},
		loading: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {

		}
	},
	methods: {
	},
})
</script>



