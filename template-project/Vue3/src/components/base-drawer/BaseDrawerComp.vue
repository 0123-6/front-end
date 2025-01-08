<template>
	<div class="base-drawer-comp w-full py-4 pr-6 flex flex-col"
	     style="height: calc(100% - var(--drawer-footer-height))"
	     v-scrollbar
	>
		<slot name="default"></slot>
	</div>
	<!--模拟尾部插槽-->
	<div class="el-drawer__footer">
		<slot name="footer"></slot>
	</div>
</template>

<script lang="ts" setup>
</script>