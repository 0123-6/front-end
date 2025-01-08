<template>
	<div class="module-five w-full py-4 pl-4 pr-6 flex flex-col">
		<!--头部-->
		<div class="flex justify-between items-start">
			<el-segmented v-model="mode" :options="modeList" size="large"/>
			<div class="h-[32px] flex items-center">
				<span class="text-primary">{{mode === '用户总览' ? '选择系统进行切换数据指标' : '选择所属团队进行切换数据指标'}}</span>
				<el-icon class="ml-1" color="#3D6FE2" size="18"><QuestionFilled/></el-icon>
				<el-select :placeholder="mode === '用户总览' ? '请选择系统' : '请选择团队'"
				           size="default"
				           v-model="system"
				           :disabled="isLoadingSystemList"
				           v-loading="isLoadingSystemList"
				           style="margin-left: 8px;width: 211px;"
				>
					<template v-slot:default>
						<el-option v-for="(item, index) in systemList"
						           :key="item.value"
						           :label="item.label"
						           :value="item.value"
						/>
					</template>
				</el-select>
			</div>
		</div>
		<!--标签-->
		<!--系统可用率统计-->
		<!--系统调度统计-->
	</div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {QuestionFilled} from "@element-plus/icons-vue";
import {baseFetch} from "@/util/api.ts";
import {ElMessage} from "element-plus";

// 模式,用户总量,团队总览
const mode = ref('用户总览')
const modeList = ['用户总览', '团队总览']
// mode变化时
watch(mode, () => {
	// 更新系统列表
	getSystemList()
})

// **********************************************************************************************************************
// 系统名称
const system = ref('')
let systemMap = new Map()
let systemName = ref('')
const systemList = ref([])
// 初始化数据
const resetSystem = () => {
	system.value = ''
	systemMap.clear()
	systemName.value = ''
	systemList.value = []
}
// 前置钩子
const beforeGetSystemListHookSet = new Set<Function>()
let getSystemListAbortController = new AbortController()
const isLoadingSystemList = ref(false)
// 设置预处理
const getSystemListHook = () => {
	for (const beforeGetHook of beforeGetSystemListHookSet) {
		beforeGetHook()
	}
	getSystemListAbortController.abort()
	getSystemListAbortController = new AbortController()
	setTimeout(() => {
		isLoadingSystemList.value = true
		resetSystem()
	}, 0)
}
// 查询
const getSystemList = async () => {
	getSystemListHook()
	try {
		if (mode.value === '用户总览') {
			const response = await baseFetch({
				url: '/getSystemList',
				signal: getSystemListAbortController.signal,
			})
			if (!response) {
				return
			}
			systemList.value = response.data.map(item => ({
				label: item.sysName,
				value: item.sysCode,
			}))
			if (systemList.value.length === 0) {
				ElMessage.error('系统列表为空')
				return
			}
			system.value = systemList.value[0].value
		} else {
			const response = await baseFetch({
				url: '/getTeamList',
				signal: getSystemListAbortController.signal,
			})
			if (!response) {
				return
			}
			systemList.value = response.data.map(item => ({
				label: item.team,
				value: item.sysinfos.map(product => product.sysCode).join(',,,***,,,'),
			}))
			systemMap.clear()
			for (const team of response.data) {
				for (const product of team.sysinfos) {
					systemMap.set(product.sysCode, product.sysName)
				}
			}
			// 异常处理
			if (systemList.value.length === 0) {
				ElMessage.error('团队列表为空')
				return
			}
			// 设置默认值
			system.value = systemList.value[0].value
		}
	} finally {
		isLoadingSystemList.value = false
	}
}
// 刚进入系统时查询一次
queueMicrotask(getSystemList)
// 当system变化时
watch(system, () => {
	if (!system.value) {
		return
	}
	// 更新systemName
	const item = systemList.value.find(item => item.value === system.value)!
	systemName.value = item.label
	// 查询其它接口

})


// **********************************************************************************************************************


// **********************************************************************************************************************
// **********************************************************************************************************************


// **********************************************************************************************************************
// **********************************************************************************************************************


// **********************************************************************************************************************
// **********************************************************************************************************************


// **********************************************************************************************************************
// **********************************************************************************************************************


// **********************************************************************************************************************
// **********************************************************************************************************************


// **********************************************************************************************************************
// **********************************************************************************************************************


// **********************************************************************************************************************
// **********************************************************************************************************************


// **********************************************************************************************************************
// **********************************************************************************************************************


// **********************************************************************************************************************
// **********************************************************************************************************************


</script>

<style scoped lang="scss">
.module-five {

}
</style>

<style>
.module-five {

}
</style>