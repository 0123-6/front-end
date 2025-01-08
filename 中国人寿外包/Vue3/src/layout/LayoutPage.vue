<script setup lang="ts">

</script>

<template>
	<!--最外层-->
	<div class="w-screen min-w-[1200px] h-screen bg-red-400 flex flex-col">
		<!--导航栏-->
		<div class="bg-white flex items-center">
			<!--左-->
			<div class="flex-1 flex justify-center items-center gap-x-2">
				<RouterLink to="/index" replace class="hover:text-red-500">首页</RouterLink>
				<RouterLink to="/module-two" replace class="hover:text-red-500">模块2</RouterLink>
				<RouterLink to="/module-three" replace class="hover:text-red-500">模块3</RouterLink>
				<RouterLink to="/module-four" replace class="hover:text-red-500">模块4</RouterLink>
				<RouterLink to="/person-center" replace class="hover:text-red-500">个人中心</RouterLink>
				<RouterLink to="/manage" replace class="hover:text-red-500">管理员</RouterLink>
			</div>
		</div>
		<!--内容区域-->
		<RouterView class="flex-grow"/>
	</div>
</template>

