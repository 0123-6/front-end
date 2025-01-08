<template>
<!--	hover:bg-[rgba(240,243,254,0.7)]-->
	<div class="rounded-lg border flex flex-col justify-between cursor-pointer select-none flex-shrink-0"
	     :class="[
				 isSelected ? 'outline outline-2' : '',
				 size === 'large' ? 'w-[160px] h-[82px] px-3 py-3.5' : 'w-[116px] h-[63px] p-2.5',
	     ]"
	     :style="{
			   backgroundColor: bgColor,
			   borderColor: isSelected ? selectedColor : bgColor,
			   outlineColor: isSelected ? hexToRgba(selectedColor, 0.2) : '',
	     }"
	>
		<!--上面-->
		<div class="flex justify-between items-center">
			<span class="text-black-two font-medium"
			      :class="[
							size === 'large' ? 'text-base leading-[22px]' : 'text-sm leading-5',
			      ]"
			>{{label}}</span>
			<div class="flex items-center gap-x-[3px]">
				<span class="ddin-n font-bold text-black"
				      :class="[
								size === 'large' ? 'text-xl leading-[22px]' : 'text-lg leading-5',
				      ]"
				>{{number}}</span>
				<span class="text-black-two leading-5"
				      :class="[
								size === 'large' ? 'text-sm' : 'text-xs',
				      ]"
				>个</span>
			</div>
		</div>
		<!--下面-->
		<div class="flex justify-between items-center">
			<!--左边-->
			<div class="flex-shrink-0 rounded-[23px] relative"
			     :class="[
						 size === 'large' ? 'w-[90px] h-2' : 'w-[56px] h-1.5',
			     ]"
			     :style="{backgroundColor: barBgColor}"
			>
				<div class="absolute top-0 left-0 h-full rounded-[23px]"
				     :style="{
								width: percent + '%',
								backgroundColor: selectedColor,
							}"
				></div>
			</div>
			<!--右边-->
			<span class="text-black ddin-n leading-[15px]"
			      :class="[
							size === 'large' ? 'text-sm' : 'text-xs',
			      ]"
			>{{Number(percent).toFixed(2)}}%</span>
		</div>
	</div>
</template>

<script>
import {hexToRgba} from "@/utils";

export default {
	name: "PeriodComp",
	methods: {hexToRgba},
	props: {
		label: {
			type: String,
			required: true,
		},
		number: {
			type: Number,
			required: true,
		},
		percent: {
			type: Number,
			required: true,
		},
		isSelected: {
			type: Boolean,
			required: true,
		},
		selectedColor: {
			type: String,
			required: true,
		},
		bgColor: {
			type: String,
			required: true,
		},
		barBgColor: {
			type: String,
			required: true,
		},
		// small,large
		size: {
			type: String,
			required: true,
		},
	},
}
</script>


<style lang="scss">

</style>