<template>
	<!--最外层-->
	<div class="w-full h-[316px] flex justify-center items-center">
		<!--项目准入,项目决策,土地储备-->
		<div class="flex flex-col items-center relative">
			<!--项目准入-->
			<div v-if="projectType === '全部' || projectType === '产业项目'"
			     class="flex flex-col items-center absolute top-[-87px]">
				<period-comp size="small"
				             label="项目准入"
				             :number="data?.period['项目准入'].value"
				             :percent="data?.period['项目准入'].percent"
				             selected-color="#8AD05F"
				             bg-color="#F3FAEF"
				             bar-bg-color="#DEF2D2"
				             :is-selected="selectedItem === '项目准入'"
				             @click="clickItem('项目准入')"
				></period-comp>
				<img src="./icon/LineToBottom.svg" alt="">
			</div>
			<!--土地储备-->
			<period-comp label="土地储备"
			             size="small"
			             :number="data?.period['土地储备'].value"
			             :percent="data?.period['土地储备'].percent"
			             selected-color="#436FF6"
			             bg-color="#F0F3FE"
			             bar-bg-color="#E1E8FE"
			             :is-selected="selectedItem === '土地储备'"
			             @click="clickItem('土地储备')"
			></period-comp>
			<!--项目决策-->
			<div v-if="projectType !== '产业项目'"
			     class="flex flex-col items-center absolute bottom-[-87px]">
				<img src="./icon/LineToTop.svg" alt="" class="select-none">
				<period-comp size="small"
				             label="项目决策"
				             :number="data?.period['项目决策'].value"
				             :percent="data?.period['项目决策'].percent"
				             selected-color="#F0C093"
				             bg-color="#FDF9F4"
				             bar-bg-color="#FAEEE1"
				             :is-selected="selectedItem === '项目决策'"
				             @click="clickItem('项目决策')"
				></period-comp>
			</div>
		</div>
		<img src="./icon/LineToRight.svg" alt="" class="select-none">
		<!--土地供应-->
		<period-comp label="土地供应"
		             size="small"
		             :number="data?.period['土地供应'].value"
		             :percent="data?.period['土地供应'].percent"
		             selected-color="#02ADEC"
		             bg-color="#EBF8FD"
		             bar-bg-color="#D7F2FC"
		             :is-selected="selectedItem === '土地供应'"
		             @click="clickItem('土地供应')"
		></period-comp>
		<img src="./icon/LineToRight.svg" alt="" class="select-none">
		<!--前期审批-->
		<period-comp label="前期审批"
		             size="small"
		             :number="data?.period['前期审批'].value"
		             :percent="data?.period['前期审批'].percent"
		             selected-color="#7ACDB4"
		             bg-color="#F2FAF7"
		             bar-bg-color="#DAF1EA"
		             :is-selected="selectedItem === '前期审批'"
		             @click="clickItem('前期审批')"
		></period-comp>
		<img src="./icon/LineToRight.svg" alt="" class="select-none">
		<!--项目建设,绩效监管,运行维护-->
		<div class="flex flex-col items-center relative">
			<!--绩效监管-->
			<div v-if="projectType === '全部' || projectType === '产业项目'"
			     class="flex flex-col items-center absolute top-[-87px]">
				<period-comp size="small"
				             label="绩效监管"
				             :number="data?.period['绩效监管'].value"
				             :percent="data?.period['绩效监管'].percent"
				             selected-color="#85B8E6"
				             bg-color="#F5F9FD"
				             bar-bg-color="#EBF4FB"
				             :is-selected="selectedItem === '绩效监管'"
				             @click="clickItem('绩效监管')"
				></period-comp>
				<img src="./icon/LineToTop.svg" alt="" class="select-none">
			</div>
			<!--项目建设-->
			<period-comp label="项目建设"
			             size="small"
			             :number="data?.period['项目建设'].value"
			             :percent="data?.period['项目建设'].percent"
			             selected-color="#9BA2E2"
			             bg-color="#F7F8FD"
			             bar-bg-color="#EFF0FA"
			             :is-selected="selectedItem === '项目建设'"
			             @click="clickItem('项目建设')"
			></period-comp>
			<!--运行维护-->
			<div v-if="projectType !== '产业项目'"
			     class="flex flex-col items-center absolute bottom-[-87px]">
				<img src="./icon/LineToBottom.svg" alt="" class="select-none">
				<period-comp v-if="projectType !== '产业项目'"
				             size="small"
				             label="运行维护"
				             :number="data?.period['运行维护'].value"
				             :percent="data?.period['运行维护'].percent"
				             selected-color="#C798CB"
				             bg-color="#F9F5FA"
				             bar-bg-color="#EFE2F1"
				             :is-selected="selectedItem === '运行维护'"
				             @click="clickItem('运行维护')"
				></period-comp>
			</div>
		</div>
	</div>
</template>

<script>

import PeriodComp from "@/views/index/components/PeriodComp.vue";

export default {
	name: "PeriodSmallGraph",
	components: {
		PeriodComp
	},
	props: {
		// 类型，全部，产业项目，其它
		projectType: {
			type: String,
			required: true,
		},
		selectedPeriod: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
	},
	computed: {
		selectedItem: {
			get() {
				return this.selectedPeriod;
			},
			set(value) {
				this.$emit('update:selected-period', value);
			}
		}
	},
	methods: {
		clickItem(item) {
			if (this.selectedItem === item) {
				this.selectedItem = '';
			} else {
				this.selectedItem = item;
			}
		}
	},
}
</script>

<style lang="scss">

</style>