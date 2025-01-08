<template>
	<!--导出报表弹框-->
	<div class="w-full flex flex-col h-[70vh]"
	     style="z-index: -100;"
	>
		<el-scrollbar height="100%">
			<!--项目当前状态-->
			<project-status-distribution class=""
			                             :only-chart="true"
			                             title-name="项目当前状态"
			                             :range-time="date1 ? date1 : [null, null]"
			                             source="analysis"
			                             show-type="vertical"
			                             @on-ok="projectStatusDistributionOnOk"
			/>
			<!--项目当前阶段-->
			<project-progress-statistics class=""
			                             :only-chart="true"
			                             title-name="项目当前阶段"
			                             :range-time="date1 ? date1 : [null, null]"
			                             source="analysis"
			                             show-type="vertical"
			                             @on-ok="projectProgressStatisticsOnOk"
			/>
			<!--项目投资分布-->
			<project-investment-distribution class=""
			                                 :only-chart="true"
			                                 :range-time="date1 ? date1 : [null, null]"
			                                 source="analysis"
			                                 show-type="vertical"
			                                 @on-ok="projectInvestmentDistributionOnOk"
			/>
			<!--项目增长分布-->
			<add-project-analysis class=""
			                      :only-chart="true"
			                      :range-time="date1 ? date1 : [null, null]"
			                      source="analysis"
			                      show-type="vertical"
			                      @on-ok="addProjectAnalysisOnOk"
			/>
		</el-scrollbar>
	</div>
</template>

<script>
import html2canvas from "html2canvas";
import ProjectStatusDistribution from "@/views/index/project-status-distribution/ProjectStatusDistribution.vue";
import ProjectProgressStatistics from "@/views/index/project-progress-statistics/ProjectProgressStatistics.vue";
import ProjectInvestmentDistribution
	from "@/views/analysis/project-investment-distribution/ProjectInvestmentDistribution.vue";
import AddProjectAnalysis from "@/views/analysis/add-project-analysis/AddProjectAnalysis.vue";
import {download} from '@/utils/request.js'

export default {
	name: "index",
	components: {
		AddProjectAnalysis,
		ProjectInvestmentDistribution,
		ProjectProgressStatistics,
		ProjectStatusDistribution
	},
	props: {
		date1: {
			type: Array,
			default: () => ['', ''],
		},
	},
	data() {
		return {
			projectStatusDistributionOk: false,
			projectProgressStatisticsOk: false,
			projectInvestmentDistributionOk: false,
			addProjectAnalysisOk: false,
			message1: null,
		};
	},
	mounted() {
		// 在所有的图表组件加载完成后，再执行导出操作
		this.$nextTick(() => {
			// 提示，后台导出中，大约需要15秒时间，请耐心等待,提示关闭时间为15s,可以手动关闭
			this.message1 = this.$message({
				message: '后台导出中，大约需要30 - 60秒时间，请耐心等待',
				type: 'info',
				duration: 30000,
				showClose: true,
			});
			// 4个图表，完全渲染好之后，再执行导出操作
			const timer = setInterval(async () => {
				if (this.projectStatusDistributionOk && this.projectProgressStatisticsOk && this.projectInvestmentDistributionOk && this.addProjectAnalysisOk) {
					clearInterval(timer);
					const promiseArr = [
						this.getImageUrlByClass('picture1', '项目当前状态'),
						this.getImageUrlByClass('picture2', '项目当前阶段'),
						this.getImageUrlByClass('picture3', '项目投资分布'),
						this.getImageUrlByClass('picture4', '项目增长分布')
					];
					const [pic1, pic2, pic3, pic4] = await Promise.all(promiseArr);
					console.log('pic1: ', pic1);
					console.log('pic2: ', pic2);
					console.log('pic3: ', pic3);
					console.log('pic4: ', pic4);
					const formData = new FormData();
					formData.append('startTime', this?.date1[0] || '');
					formData.append('endTime', this?.date1[1] || '');
					formData.append('projectStatusPic', pic1);
					formData.append('projectPeriodPic', pic2);
					formData.append('projectInvestPic', pic3);
					formData.append('projectIncreasePic', pic4);
					// startTime endTime
					let url = '/pm/ruProjectBaseinfo/exportProjectSituation';
					await download(url, formData, '项目态势报表.docx', null, false);
					if (this.message1) {
						this.message1.close();
					}
					this.$message({
						message: '导出报表成功，请查看浏览器下载目录',
						type: 'success',
						duration: 10000,
						showClose: true,
					});
					this.$emit('on-ok');
				}
			}, 1000);
		});
	},
	methods: {
		projectStatusDistributionOnOk() {
			this.projectStatusDistributionOk = true;
		},
		projectProgressStatisticsOnOk() {
			this.projectProgressStatisticsOk = true;
		},
		projectInvestmentDistributionOnOk() {
			this.projectInvestmentDistributionOk = true;
		},
		addProjectAnalysisOnOk() {
			this.addProjectAnalysisOk = true;
		},
		// 先传指定图片，返回对应的url
		async getImageUrlByClass(classname, fileName) {
			// 使用html2canvas库导出项目当前状态对应的部分为图片，下面直接写代码
			const canvas = await html2canvas(document.querySelector('.' + classname));
			const imgUrl = canvas.toDataURL('image/png');
			const response = await fetch(imgUrl);
			const blob = await response.blob();
			// 生成文件对象
			return new File([blob], fileName + '.png', {type: 'image/png'});
		},
	},
}
</script>

<style lang="scss">

</style>