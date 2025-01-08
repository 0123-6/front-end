<script setup lang="ts">
import {reactive} from "vue";
import {Refresh, Search} from "@element-plus/icons-vue";
import type {IPageGeneratorProps} from "@/components/page-generator/PageGenerator.ts";

// 获取props
const { searchParams } = defineProps<IPageGeneratorProps>()
const emit = defineEmits()

// 定义响应式状态
const searchParams = reactive({
	// 页码
	pageNumber: 1,
	// 每页个数
	pageSize: 10,

	// 排序属性
	sortKey: '',
	// 排序方式,增序asc, 降序desc
	sortMethod: '',
	// 筛选属性
	filterKey: '',
	// 筛选的值
	filterList: [],
})
// 将传入的查询参数附加到searchParams中
for (const searchItem of props.searchParams) {
	searchParams[searchItem.key] = searchItem.type !== 'date' ? '' : []
}

const search = () => {

}

const reset = () => {

}



//
// import {onBeforeMount, ref} from "vue";
// import {myFetch} from "@/util/api.ts";
//
// // 搜索参数
// const keyword = ref('')
// const love = ref('')
// const pageSize = ref(10)
// const pageNumber = ref(1)
//
// // 表格配置
// const isLoading = ref(false)
// const filterProvinceList = [
// 	{text: '河南省', value: '河南省'},
// 	{text: '北京市', value: '北京市'},
// 	{text: '天津市', value: '天津市'},
// ]
//
// // 搜索结果
// const list = ref([])
// const totalNumber = ref(0)
//
// // 搜索
// const search = async () => {
// 	isLoading.value = true
// 	const fetchResult = await myFetch({
// 		url: '/search',
// 		method: 'get',
// 		data: {
// 			keyword: keyword.value,
// 			love: love.value,
// 			pageSize: pageSize.value,
// 			pageNumber: pageNumber.value
// 		},
// 	})
// 	// 出错了
// 	if (fetchResult === undefined) {
// 		isLoading.value = false
// 		return
// 	}
// 	list.value = fetchResult.list
// 	totalNumber.value = fetchResult.totalNumber
// 	isLoading.value = false
// }
//
// const selectable = (row, index) => {
// 	// return index % 2 === 0
// 	return true
// }
//
// onBeforeMount(() => {
// 	search()
// })


</script>

<template>
	<!--最外层-->
	<div class="page-generator w-full h-full bg-amber-200">
		<!--搜索条件-->
		<ElForm :model="searchParams" inline>
			<ElFormItem v-for="(searchItem, searchItemIndex) in props.searchParams"
			            :key="searchItemIndex"
			            :label="searchItem.label"
			>
				<!--1. type='input'-->
				<ElInput v-if="searchItem.type === 'input'" v-model="searchParams[searchItem.key]"/>
				<!--2. type='select'-->
				<ElSelect v-else-if="searchItem.type === 'select'" v-model="searchParams[searchItem.key]">
					<ElOption v-for="(item, index) in searchItem.selectList"
					          :key="index"
					          :label="item.label"
					          :value="item.value"
					/>
				</ElSelect>
				<!--3. type='date'-->
				<ElDatePicker v-else-if="searchItem.type === 'date'"
				              v-model="searchParams[searchItem.key]"
				              type="daterange"
				              range-separator="到"
				              :start-placeholder="searchItem.placeholder[0]"
				              :end-placeholder="searchItem.placeholder[1]"
				/>
			</ElFormItem>
			<ElButton type="primary" @click="search">
				<ElIcon><Search/></ElIcon>
				<span class="ml-1">搜索</span>
			</ElButton>
			<ElButton @click="reset">
				<ElIcon><Refresh/></ElIcon>
				<span class="ml-1">重置</span>
			</ElButton>
		</ElForm>
	</div>


	<!--搜素条件,根据关键字,爱好-->

	<!--表格 + 分页-->
	<!--	<div>-->
	<!--		&lt;!&ndash;无数据&ndash;&gt;-->
	<!--		<div v-if="totalNumber === 0" class="w-[500px] h-[500px] bg-pink-500 flex justify-center items-center">-->
	<!--			<span>无数据</span>-->
	<!--		</div>-->
	<!--		&lt;!&ndash;有数据&ndash;&gt;-->
	<!--		&lt;!&ndash;表格&ndash;&gt;-->
	<!--		<ElTable :data="list" border>-->
	<!--			<ElTableColumn type="selection" label="多选" width="50px" fixed="left" resizable align="center" header-align="center" :selectable="selectable"/>-->
	<!--			<ElTableColumn type="index" label="序号" width="50px" fixed="left" sortable="custom" resizable align="center" header-align="center"/>-->
	<!--			<ElTableColumn label="名字" prop="name" min-width="200px" resizable show-overflow-tooltip align="center" header-align="center"/>-->
	<!--			<ElTableColumn label="年龄" prop="age" min-width="200px" sortable="custom" resizable align="center" header-align="center"/>-->
	<!--			<ElTableColumn label="喜欢值" prop="love" min-width="200px" sortable="custom" resizable align="center" header-align="center"/>-->
	<!--			<ElTableColumn label="省份" prop="province" min-width="200px" resizable show-overflow-tooltip align="center" header-align="center" column-key="province" :filters="filterProvinceList"/>-->
	<!--			<ElTableColumn label="操作列" width="200px" fixed="right" resizable align="center" header-align="center">-->
	<!--				<template v-slot:default="{row}">-->
	<!--					<div class="flex justify-center items-center gap-x-2">-->
	<!--						<ElButton text type="primary">查看</ElButton>-->
	<!--						<ElButton text type="danger">删除</ElButton>-->
	<!--					</div>-->
	<!--				</template>-->
	<!--			</ElTableColumn>-->
	<!--		</ElTable>-->
	<!--		&lt;!&ndash;分页&ndash;&gt;-->
	<!--	</div>-->
</template>

<style>
.page-generator {
	.el-button {
		vertical-align: top;
	}
}
</style>
