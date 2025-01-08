<script setup lang="ts">
import PageGenerator, {IPageGeneratorProps} from "@/components/PageGenerator.vue";

const pageGeneratorProps: IPageGeneratorProps = {
	searchParams: [
		{
			type: 'input',
			label: '角色名称',
			placeholder: '请输入角色名称',
			key:'roleName',
		},
		{
			type: 'input',
			label: '权限字符',
			placeholder: '请输入权限字符',
			key: 'permissionChar',
		},
		{
			type: 'select',
			label: '状态',
			placeholder: '角色状态',
			key: 'roleStatus',
			selectList: [
				{label: '正常', value: 1,},
				{label: '停用', value: 0,},
			],
		},
		{
			type: 'date',
			label: '创建时间',
			placeholder: ['开始日期', '结束日期'],
			key: 'createDate',
		},
	],
}


</script>

<template>
	<!--最外层-->
	<div class="element-plus-page w-screen min-w-[1200px] h-screen bg-amber-200 flex flex-col">
		<!--头部菜单栏-->
		<div class="w-full h-[60px] bg-pink-500"></div>
		<!--内容区-->
		<div class="w-full flex-1 bg-blue-700 flex">
			<!--左边菜单-->
			<div class="w-[200px] h-full bg-amber-600"></div>
			<!--右边内容区域-->
			<div class="flex-1 h-full bg-green-500 p-4">
				<PageGenerator :props="pageGeneratorProps"></PageGenerator>
			</div>
		</div>
	</div>
</template>

<style>
.element-plus-page {

}
</style>
