<script lang="ts" setup>
import {defineProps} from "vue";

interface IProps {
	title: string
}

const props = defineProps<IProps>()
</script>

<template>
	<div class="hpj base-title flex items-center">
		<div class="w-[4px] h-[16px] bg-primary rounded-r-sm"/>
		<span class="ml-4 text-text-title font-medium text-base">{{props.title}}</span>
	</div>
</template>