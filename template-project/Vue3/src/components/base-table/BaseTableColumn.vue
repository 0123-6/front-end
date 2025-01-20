<script lang="ts" setup>
import {defineProps} from "vue";

interface IProps {
	content?: any,
	contentColor?: string,
	lineClamp?: number,
}
const styleMap = {
	primary: '#3D6FE2',
	success: '#3AC295',
	warning: '#F89741',
	error: '#E34D59',
	text: '#333333',
}
const props = defineProps<IProps>()
</script>

<template>
	<div class="hpj base-table-column w-full h-full flex flex-col justify-center items-center">
		<slot v-if="$slots.default" name="default"></slot>
		<span v-else
		      class="text-left tracking-tight break-all leading-[20px]"
		      :style="{
						color: styleMap[props?.contentColor || 'text']
					}"
		      :class="[props?.lineClamp == 2 ? 'line-clamp-2' : 'line-clamp-1']"
		>{{props.content}}</span>
	</div>
</template>