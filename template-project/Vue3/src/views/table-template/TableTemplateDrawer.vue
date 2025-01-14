<script setup lang="ts">
import {useTemplateRef} from "vue";
import {useElForm} from "@/util/hooks/element-plus-component-hooks/useElForm.ts";
import {useBaseFetch} from "@/util/hooks/useBaseFetch.ts";
import {ElMessage} from "element-plus";
import BaseDrawerComp from "@/components/base-drawer/BaseDrawerComp.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import BaseContent from "@/components/base-content/BaseContent.vue";
import BaseContentItem from "@/components/base-content/BaseContentItem.vue";

interface IProps {
	list: object[],
	alarmTypeList: object[],
}
const props = defineProps<IProps>()
const emits = defineEmits(['ok', 'cancel'])

const formRef = useTemplateRef('formRef')
const formObject = useElForm({
	formRef,
	dataFn: () => ({
		alarmType: '',
		name: '',
		desc: '',
		isLove: 0,
		loveNumber: 0,
	}),
	rules: {
		alarmType: [
			{required: true, trigger: 'change', message: '请选择告警类型'},
		],
		name: [
			{required: true, trigger: 'change', message: '请输入名称'},
			{min:1, max: 200, message: '字符限制为200字以内',},
		],
		desc: [
			{required: true, trigger: 'change', message: '请输入描述'},
			{min:1, max: 200, message: '字符限制为200字以内',},
		],
		isLove: [
			{required: true, trigger: 'change', message: '请选择是否喜欢'},
		],
		loveNumber: [
			{required: true, trigger: 'change', message: '请输入喜欢程度分数'},
		],
	},
})
if (props.list.length === 1) {
	const item = props.list[0]
	formObject.reset({
		name: item.name,
		desc: item.desc,
		isLove: item.isLove ? 1 : 0,
		loveNumber: item.loveNumber ?? 0,
	})
}

const fetchUpdate = useBaseFetch({
	fetchOptionFn: () => ({
		url: '/update',
		data: {
			ids: props.list.map(item => item.id),
			...formObject.data,
		},
	}),
})
const clickOk = async () => {
	if (!await formObject.validate()) {
		return
	}
	const isOk = await fetchUpdate.doFetch()
	if (!isOk) {
		return
	}
	ElMessage.success('编辑成功!')
	emits('ok')
}
const clickCancel = () => {
	emits('cancel')
}
</script>

<template>
	<base-drawer-comp>
		<template v-slot:default>
			<base-title title="信息编辑"/>
			<el-form ref="formRef"
			         :model="formObject.data"
			         :rules="formObject.rules"
			         label-position="right"
			         :label-width="130"
			         :scroll-to-error="true"
			         style="margin-top: 16px;width: 100%;"
			>
				<el-form-item label="告警类型" prop="alarmType">
					<el-select placeholder="请选择告警类型"
					           size="default"
					           v-model="formObject.data.alarmType"
					           clearable
					           filterable
					           style="width: 240px;"
					>
						<el-option v-for="(item, index) in props.alarmTypeList"
						           :key="item.value"
						           :label="item.label"
						           :value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="名称" prop="name">
					<el-input v-model="formObject.data.name"
					          clearable
					          placeholder="请输入名称"
					/>
				</el-form-item>
				<el-form-item label="描述" prop="desc">
					<el-input v-model="formObject.data.desc"
					          :rows="3"
					          clearable
					          placeholder="请输入描述信息"
					          type="textarea"
					          :maxlength="200"
					          show-word-limit
					/>
				</el-form-item>
				<el-form-item label="是否喜欢" prop="isLove">
					<el-radio-group v-model="formObject.data.isLove">
						<el-radio :value="1">是</el-radio>
						<el-radio :value="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="喜欢程度分数" prop="loveNumber">
					<el-input-number v-model="formObject.data.loveNumber"
					                 style="width: 240px;"
					/>
				</el-form-item>
			</el-form>
			<!--展示-->
			<base-title title="选择的项" class="mt-4"/>
			<div v-if="props.list"
			     class="mt-4 pl-5 flex flex-col gap-y-4"
			>
				<base-content v-for="(item, index) in props.list"
				              :key="index"
				>
					<base-content-item :left-width="105"
					                   label="名称"
					                   :value="item.name"/>
					<base-content-item :left-width="105"
					                   label="描述"
					                   :value="item.desc"/>
					<base-content-item :left-width="105"
					                   label="是否喜欢"
					                   :value="item.isLove ? '是' : '否'"
					                   :color="item.isLove ? 'success' : 'error'"
					/>
					<base-content-item :left-width="105"
					                   label="喜欢程度分数"
					                   :value="item.loveNumber"/>
				</base-content>
			</div>
		</template>
		<template v-slot:footer>
			<el-button style="width: 80px;"
			           @click="clickCancel"
			>取消</el-button>
			<el-button type="primary"
			           style="margin-left: 16px;width: 80px;"
			           :loading="fetchUpdate.isFetching"
			           @click="clickOk"
			>保存</el-button>
		</template>
	</base-drawer-comp>
</template>










































