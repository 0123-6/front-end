<script setup lang="ts">
import {computed, ref} from "vue";
import {useElForm} from "@/util/hooks/element-plus-component-hooks/useElForm.ts";
import {dateToYYYYMMDDHHMMSS} from "@/util/date.ts";
import dayjs from "dayjs";
import {FormInstance} from "element-plus";

const a = ref(100)
const formRef = ref<FormInstance>()
const formObject = useElForm<{
	systemList: string[],
	alarmTypeList: string[],
	statusList: string[],
	beginTime: string,
	endTime: string,
}>({
	formRef,
	dataFn: () => ({
		systemList: [],
		alarmTypeList: [],
		statusList: [],
		beginTime: dateToYYYYMMDDHHMMSS(dayjs().subtract(6, 'day')),
		endTime: dateToYYYYMMDDHHMMSS(new Date()),
	}),
})
const alarmDate = computed({
	get: () => ([formObject.data.beginTime, formObject.data.endTime]),
	set: newValue => {
		formObject.data.beginTime = dateToYYYYMMDDHHMMSS(newValue[0])
		formObject.data.endTime = dateToYYYYMMDDHHMMSS(newValue[1])
	}
})
</script>

<template>
	<div class="flex flex-col">
		<span>{{a}}</span>
		<el-form ref="formRef"
		         :model="formObject.data"
		></el-form>
	</div>
</template>