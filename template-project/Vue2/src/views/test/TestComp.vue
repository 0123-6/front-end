<template>
	<!--最外层-->
	<div class="text-comp flex-grow flex flex-col items-center">
		<el-popover
			trigger="hover"
			placement="top"
			popper-class="el-popover-test-comp"
		>
			<div class="w-[600px] h-[600px] flex flex-col bg-[orange]">

			</div>
			<button class="mt-[700px]" slot="reference">hover 激活</button>
		</el-popover>
	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
	name: "TestComp",
})
</script>

<style>
.el-popover.el-popover-test-comp[x-placement^=top] {
	padding: 0;
	margin-bottom: 6px;

	/*修改箭头的颜色*/
	.popper__arrow {
		border-top-color: orange;
		/*箭头距离矩形元素的偏移值*/
		bottom: -3px;
	}
	.popper__arrow::after {
		border-top-color: orange;
	}
}
</style>
