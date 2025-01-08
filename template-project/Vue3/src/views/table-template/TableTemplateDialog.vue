<script setup lang="ts">
import {useBaseFetch} from "@/util/hooks/useBaseFetch.ts";

interface IProps {
	data: object,
}
const props = defineProps<IProps>()
const emits = defineEmits(['ok', 'cancel'])

const fetchDownload = useBaseFetch({
	fetchOptionFn: () => ({
		url: '/downloadFile',
		isFile: true,
		data: {
			...props.data,
		},
	}),
})
const clickOk = async () => {
	await fetchDownload.doFetch()
	emits('ok')
}
const clickCancel = () => {
	emits('cancel')
}
</script>

<template>
	<div class="flex flex-col">
		<span class="w-full text-text">确认下载文件吗?</span>
		<div class="mt-4 flex justify-end items-center">
			<el-button style="width: 60px;"
			           @click="clickCancel"
			>取消</el-button>
			<el-button type="primary"
			           :loading="fetchDownload.isFetching"
			           style="margin-left: 8px;width: 88px;"
			           @click="clickOk"
			>{{!fetchDownload.isFetching ? '确认下载' : '下载中'}}</el-button>
		</div>
	</div>
</template>




































