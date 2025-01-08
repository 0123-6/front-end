<template>
	<!--项目态势-->
	<div class="analysis w-full h-full flex flex-col relative text-sm">
		<!--顶部-->
		<div class="h-[73px] flex-shrink-0 bg-[#d8e2ec] flex justify-between items-center px-6">
			<!--左-->
			<div class="flex items-center">
				<span class="text-black-two text-sm">统计周期：</span>
				<el-date-picker
					v-model="date1"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					value-format="YYYY-MM-DD"
				/>
				<el-tooltip placement="bottom"
				            popper-class="tooltip-76 tooltip-x-14 tooltip-y-6"
				>
					<template #content>
						<div class="w-full flex items-center">
							<span class="text-white text-sm leading-[22px]">使用“项目创建时间”来筛选项目</span>
						</div>
					</template>
					<img src="./icon/info-circle.svg" alt="" class="ml-2.5">
				</el-tooltip>
			</div>
			<!--右-->
			<el-button type="primary"
			           :disabled="isExporting"
			           @click="exportReport">
				<svg-icon icon-class="export" width="16px" height="16px" color="#fff" />
				<span class="ml-1">导出报表</span>
			</el-button>
		</div>
		<!--内容区域-->
		<div class="m-5 flex flex-col relative flex-shrink-0"
		     style="height: calc(100% - 113px);"
		>
			<!--菜单栏-->
			<div class="h-[40px] flex items-center">
				<div v-for="(item, index) in menuList"
				     :key="index"
				     class="h-[40px] mr-1 cursor-pointer flex justify-center items-center text-base leading-[22px] z-20 select-none"
				     :class="[
							 item.length === 6 ? 'w-[128px]' : '',
							 item.length === 8 ? 'w-[160px]' : '',
							 selectedMenu === item ? 'bg-white text-main font-medium' : 'bg-[rgba(255,255,255,0.60)] text-black-three'
				     ]"
				     :style="{
							 borderRadius: '8px 8px 0 0',
						 }"
				     @click="selectedMenu = item"
				>
					<span>{{item}}</span>
				</div>
			</div>
			<!--内容部分-->
			<div class="w-full flex flex-col bg-white overflow-hidden pb-5"
			     style="height: calc(100% - 40px);box-shadow: 0px 0px 8px rgba(17, 35, 41, 0.09);border-radius: 0 16px 16px 16px;">
				<el-scrollbar height="100%">
					<!--项目当前状态-->
					<div v-if="selectedMenu === '项目当前状态'"
					     class="flex flex-col z-10">
						<!--				<title-comp title="项目当前状态"/>-->
						<project-status-distribution class=""
						                             title-name="项目当前状态"
						                             :range-time="date1 ? date1 : [null, null]"
						                             source="analysis"
						                             show-type="vertical"
						/>
					</div>
					<!--项目当前阶段-->
					<div v-if="selectedMenu === '项目当前阶段'"
					     class="flex flex-col z-10">
						<!--				<title-comp title="项目当前阶段"/>-->
						<project-progress-statistics class=""
						                             title-name="项目当前阶段"
						                             :range-time="date1 ? date1 : [null, null]"
						                             source="analysis"
						                             show-type="vertical"
						/>
					</div>
					<!--工程性质分布-->
					<div v-if="selectedMenu === '工程性质分布'"
					     class="flex flex-col">
						<!--				<title-comp title="工程性质分布"/>-->
						<project-type-number-distribution class=""
						                                  :range-time="date1 ? date1 : [null, null]"
						                                  source="analysis"
						                                  show-type="vertical"
						/>
					</div>
					<!--项目投资分布-->
					<div v-if="selectedMenu === '项目投资分布'"
					     class="flex flex-col">
						<!--				<title-comp title="项目投资分布"/>-->
						<project-investment-distribution class=""
						                                 :range-time="date1 ? date1 : [null, null]"
						                                 source="analysis"
						                                 show-type="vertical"
						/>
					</div>
					<!--项目增长分布-->
					<div v-if="selectedMenu === '项目增长分布'"
					     class="mb-8 flex flex-col">
						<!--				<title-comp title="项目增长分布"/>-->
						<add-project-analysis class=""
						                      :range-time="date1 ? date1 : [null, null]"
						                      source="analysis"
						                      show-type="vertical"
						/>
					</div>
				</el-scrollbar>
			</div>
		</div>
		<!--导出报表弹框-->
		<el-dialog
			v-model="showExportReportDialog"
			draggable
			destroy-on-close
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			class="change-password-dialog z-[-10] opacity-0 pointer-events-none"
			title="导出报表"
			width="1440px"
		>
			<export-report-dialog :date1="date1"
			                      @on-ok="exportReportDialogOnOk"
			                      @on-cancel="exportReportDialogOnCancel"/>
		</el-dialog>
	</div>
</template>

<script>
import TitleComp from "@/views/index/components/TitleComp";
import ProjectStatusDistribution from "@/views/index/project-status-distribution/ProjectStatusDistribution";
import ProjectProgressStatistics from "@/views/index/project-progress-statistics/ProjectProgressStatistics";
import ProjectTypeNumberDistribution from "@/views/analysis/project-type-number-distribution/ProjectTypeNumberDistribution";
import ProjectInvestmentDistribution from "@/views/analysis/project-investment-distribution/ProjectInvestmentDistribution";
import AddProjectAnalysis from "@/views/analysis/add-project-analysis/AddProjectAnalysis";
import ExportReportDialog from "@/views/analysis/export-report-dialog";


export default {
	name: 'Analysis',
	components: {
		AddProjectAnalysis,
		TitleComp,
		ProjectStatusDistribution,
		ProjectProgressStatistics,
		ProjectTypeNumberDistribution,
		ProjectInvestmentDistribution,
		ExportReportDialog,
	},
	data() {
		return {
			// 导出报表弹框
			showExportReportDialog: false,
			date1: [null, null],
			// '工程性质分布'
			menuList: ['项目当前状态', '项目当前阶段', '项目投资分布', '项目增长分布'],
			selectedMenu: '项目当前状态',
			// 是否导出中
			isExporting: false,
		};
	},
	watch: {
		date1(val) {
			console.log(val);
		},
	},
	methods: {
		// 导出报表
		exportReport() {
			this.showExportReportDialog = true;
			this.isExporting = true;
		},
		exportReportDialogOnOk() {
			this.showExportReportDialog = false;
			this.isExporting = false;
		},
		exportReportDialogOnCancel() {
			this.showExportReportDialog = false;
			this.isExporting = false;
		},
	},
};
</script>

<style lang="scss">
.analysis {
	.el-button {
		height: 32px;
		padding: 0 10px;
		border-radius: 8px;
	}
	.el-overlay {
		z-index: -1000!important;
		background-color: unset!important;
	}
}
</style>
