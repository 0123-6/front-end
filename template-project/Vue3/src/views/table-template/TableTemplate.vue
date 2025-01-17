<script setup lang="ts">
import {isPermission} from "@/plugin/pinia.ts";
import {useAlarmTypeList, useSystemList} from "@views/hooks/commonApi.ts";
import {computed, ref} from "vue";
import {useElForm} from "@/util/hooks/element-plus-component-hooks/useElForm.ts";
import {dateShortcutsWeekAndMonthAndYear, dateToYYYYMMDDHHMMSS, isAfterToday} from "@/util/date.ts";
import dayjs from "dayjs";
import {useElTable} from "@/util/hooks/element-plus-component-hooks/useElTable.ts";
import {useElFeedback} from "@/util/hooks/element-plus-component-hooks/useElFeedback.ts";
import {EditPen, RefreshRight, Search} from "@element-plus/icons-vue";
import BaseTableColumn from "@/components/base-table/BaseTableColumn.vue";
import TableNoData from "@/components/table-no-data/TableNoData.vue";
import TableTemplateDrawer from "@views/table-template/TableTemplateDrawer.vue";
import TableTemplateDialog from "@views/table-template/TableTemplateDialog.vue";
import {FormInstance, TableInstance} from "element-plus";

const fetchSystemList = isPermission('fetchSystemList') ? useSystemList() : null
const fetchAlarmTypeList = useAlarmTypeList()
// 状态数组
const statusList = [
	{label: '首次异常', value: '1'},
	{label: '持续异常', value: '2'},
	{label: '恢复', value: '0'},
]

const formRef = ref<FormInstance>()
const formObject = useElForm({
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
if (location.search) {
	const searchParams = new URLSearchParams(location.search)
	formObject.reset({
		systemList: searchParams.get('systemList')!.split(',').map(item => Number(item)),
		beginTime: searchParams.get('beginTime'),
		endTime: searchParams.get('endTime'),
	})
}

const tableRef = ref<TableInstance>()
const tableObject = useElTable({
	tableRef,
	fetchUrl: '/getTableData',
	// fetchUrl: '/case-log/getCaseLogsByAlarmInfoId/' + new URLSearchParams(location.search).get('id'),
	fetchData: () => ({
		...formObject.data,
	}),
})
formObject.addResetHook(tableObject.reset)
const clickSearch = async () => {
	if (!await formObject.validate()) {
		return
	}
	tableObject.reset()
	await tableObject.doFetch()
}
const clickReset = () => {
	formObject.reset()
	tableObject.doFetch()
}

const drawerObject = useElFeedback({
	dataFn: () => ({
		showDrawerType: '',
	}),
	resetHook: () => {
		tableObject.tableRef.value!.clearSelection()
	},
	okHook: tableObject.doFetch,
})
const clickArrayEdit = () => {
	drawerObject.reset({
		showDrawerType: 'array',
		isShow: true,
	})
}
const clickEdit = (item: Record<string, any>) => {
	drawerObject.reset({
		showDrawerType: 'item',
		selectItem: item,
		isShow: true,
	})
}

const dialogObject = useElFeedback()
const clickDownload = () => {
	dialogObject.reset({
		isShow: true,
	})
}

</script>

<template>
	<div class="hpj table-template w-full grow rounded bg-white p-4 flex flex-col">
		<!--标题-->
		<span class="text-text-title font-medium text-base">表格信息查询</span>
		<!--form表单-->
		<div class="mt-4 h-[112px] rounded bg-[#f6f7fc] p-4 flex gap-x-8">
			<!--左-->
			<el-form ref="formRef"
			         :model="formObject.data"
			         :rules="formObject.rules"
			         inline
			         label-position="right"
			         :label-width="70"
			         :scroll-to-error="true"
			         style="width: calc(100% - 80px - 32px);height: 100%;"
			>
				<el-form-item v-if="isPermission('fetchSystemList')"
				              label="系统名称"
				              prop="systemList"
				>
					<el-select placeholder="请选择需查看的系统名称"
					           size="default"
					           v-model="formObject.data.systemList"
					           :disabled="fetchSystemList.isFetching"
					           v-loading="fetchSystemList.isFetching"
					           multiple
					           clearable
					           filterable
					           collapse-tags
					           collapse-tags-tooltip
					           style="width: 322px;"
					>
						<el-option v-for="(item) in fetchSystemList.systemList"
						           :key="item.value"
						           :label="`${item.label}[${item.value}]`"
						           :value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="告警类别" prop="alarmTypeList">
					<el-select placeholder="请选择异常告警类别"
					           size="default"
					           v-model="formObject.data.alarmTypeList"
					           :disabled="fetchAlarmTypeList.isFetching"
					           v-loading="fetchAlarmTypeList.isFetching"
					           multiple
					           clearable
					           filterable
					           collapse-tags
					           collapse-tags-tooltip
					           style="width: 322px;"
					>
						<el-option v-for="(item) in fetchAlarmTypeList.alarmTypeList"
						           :key="item.value"
						           :label="item.label"
						           :value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="状态" prop="statusList">
					<el-select placeholder="请选择告警恢复状态"
					           size="default"
					           v-model="formObject.data.statusList"
					           multiple
					           clearable
					           filterable
					           collapse-tags
					           collapse-tags-tooltip
					           style="width: 322px;"
					>
						<el-option v-for="(item) in statusList"
						           :key="item.value"
						           :label="item.label"
						           :value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="告警时间" prop="alarmDate">
					<el-date-picker v-model="alarmDate"
					                type="datetimerange"
					                range-separator="至"
					                start-placeholder="开始日期"
					                end-placeholder="结束日期"
					                unlink-panels
					                size="default"
					                :shortcuts="dateShortcutsWeekAndMonthAndYear"
					                style=""
					                :clearable="false"
					                :disabled-date="isAfterToday"
					></el-date-picker>
				</el-form-item>
			</el-form>
			<!--右-->
			<div class="w-[80px] h-full flex flex-col justify-between">
				<el-button type="primary" :icon="Search" @click="clickSearch">查询</el-button>
				<el-button :icon="RefreshRight" @click="clickReset">重置</el-button>
			</div>
		</div>
		<!--操作行-->
		<div v-if="isPermission('edit')"
		     class="mt-6 flex items-center gap-x-4">
			<el-button type="primary"
			           :disabled="drawerObject.data.selectItemList.length === 0"
			           :icon="EditPen"
			           @click="clickArrayEdit"
			>批量修改</el-button>
			<el-button type="warning"
			           @click="clickDownload"
			>数据下载</el-button>
		</div>
		<!--表格-->
		<el-table ref="tableRef"
		          :data="tableObject.data.list"
		          v-loading="tableObject.isFetching"
		          @selection-change="drawerObject.data.selectItemList = $event"
		          @sort-change="tableObject.changeSort"
		          stripe
		          :row-style="{height: '72px!important',}"
		          style="margin-top: 16px;width: 100%;height: calc(100vh - 32px - 32px - 24px - 16px - 112px - 24px - 32px - 16px - 16px - 32px);"
		>
			<el-table-column type="selection" width="38" align="center" fixed="left"/>
			<el-table-column prop="index" label="序号" width="60" align="center" fixed="left">
				<template v-slot:default="scope">
					<base-table-column :content="scope.row.index"
					                   :line-clamp="2"
					/>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="名称" min-width="120" align="center">
				<template v-slot:default="scope">
					<base-table-column :content="scope.row.name"
					                   :line-clamp="2"/>
				</template>
			</el-table-column>
			<el-table-column prop="desc" label="描述" min-width="120" align="center">
				<template v-slot:default="scope">
					<base-table-column :content="scope.row.desc"
					                   :line-clamp="2"/>
				</template>
			</el-table-column>
			<el-table-column prop="isLove" label="是否喜欢" width="200" align="center">
				<template v-slot:default="scope">
					<base-table-column :content="scope.row.isLove"
					                   :content-color="scope.row.isLove ? 'success' : 'warning'"
					                   :line-clamp="1"
					/>
				</template>
			</el-table-column>
			<el-table-column prop="loveNumber" label="喜欢程度分数" sortable="custom" width="166" align="center">
				<template v-slot:default="scope">
					<base-table-column :content="scope.row.loveNumber"
					                   :line-clamp="2"
					/>
				</template>
			</el-table-column>
			<el-table-column prop="opeartor" label="操作" width="90" align="center" fixed="right">
				<template v-slot:default="scope">
					<base-table-column>
						<div class="flex items-center">
							<button v-if="isPermission('cuckoo:alarm:edit')"
							        class="mr-2 text-primary hover:text-primary-hover"
							        @click="clickEdit(scope.row)"
							>编辑</button>
						</div>
					</base-table-column>
				</template>
			</el-table-column>
			<template v-slot:empty>
				<TableNoData/>
			</template>
		</el-table>
		<!--总条数 + 分页器-->
		<div class="mt-4 h-[32px] flex justify-between items-center">
			<span class="text-text">共 {{tableObject.data.total}} 项数据</span>
			<el-pagination layout="sizes, prev, pager, next, jumper, ->"
			               size="default"
			               :background="true"
			               v-model:current-page="tableObject.params.pageNum"
			               v-model:page-size="tableObject.params.pageSize"
			               :total="tableObject.data.total"
			               :page-sizes="[10, 20, 30]"
			               @change="tableObject.doFetch"
			/>
		</div>
		<!--feedback交互组件-->
		<el-drawer v-model="drawerObject.data.isShow"
		           title="编辑"
		           :close-on-click-modal="true"
		           :close-on-press-escape="false"
		           :destroy-on-close="true"
		           :size="712"
		           @close="drawerObject.onCancel"
		>
			<table-template-drawer :list="drawerObject.data.showDrawerType === 'item' ? [drawerObject.data.selectItem] : drawerObject.data.selectItemList"
			                       :alarm-type-list="fetchAlarmTypeList.alarmTypeList"
			                       @ok="drawerObject.onOk"
			                       @cancel="drawerObject.onCancel"
			/>
		</el-drawer>
		<el-dialog v-model="dialogObject.data.isShow"
		           title="下载数据报表"
		           :width="400"
		           :close-on-click-modal="true"
		           :close-on-press-escape="false"
		           :draggable="true"
		           :align-center="true"
		           :destroy-on-close="true"
		           @close="dialogObject.onCancel"
		>
			<table-template-dialog :data="{...formObject.data, ...tableObject.params, }"
			                       @ok="dialogObject.onOk"
			                       @cancel="dialogObject.onCancel"
			/>
		</el-dialog>
	</div>
</template>





























