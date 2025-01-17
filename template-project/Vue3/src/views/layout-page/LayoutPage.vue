<template>
	<div class="w-full h-full flex flex-col"
	     :style="{padding: isChildWeb ? '4px 24px 0 16px' : '16px 24px 0 16px',}"
	>
		<RouterView></RouterView>
		<div class="h-[16px] shrink-0"></div>
	</div>
</template>

<script lang="ts" setup>
import {onMounted} from "vue";
import {getParentUrl} from "@/util/env";
import {usePermissionsStore} from "@/plugin/pinia";
import router from "@/plugin/vue-router";
import {useEventListener} from "@vueuse/core";

onMounted(() => {
	// 如果父网站存在
	if (window.parent !== window) {
		window.parent?.postMessage({
			type: 'init',
			data: JSON.stringify(null),
		}, getParentUrl())
	}
})
useEventListener('message', event => {
	if (event.origin !== getParentUrl()) {
		console.log('无效的message', event)
		return
	}

	console.log('子项目收到父项目信息, event: ', event)
	const eventData = JSON.parse(event.data?.data || 'null')
	if (event.data.type === 'init') {
		const permissionsStore = usePermissionsStore()
		permissionsStore.permissions = eventData.permissions
		router.replace(eventData.uri)
	} else if (event.data.type === 'uri') {
		router.replace(eventData.uri)
	}
})
const isChildWeb = window !== window.parent

</script>