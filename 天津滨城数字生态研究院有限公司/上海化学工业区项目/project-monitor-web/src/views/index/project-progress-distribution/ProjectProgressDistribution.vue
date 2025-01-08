<template>
  <!--项目处理进度分布-->
  <div class="project-progress-distribution px-5 flex flex-col h-[411px] bg-white rounded-2xl"
    style="box-shadow: 3px 0px 8px rgba(17, 35, 41, 0.09);">
    <!--标题-->
    <el-radio-group class="ee-radio-group" v-model="type">
      <el-radio-button v-for="(item, index) in projectProgressDistributionTypeList" :label="item.name" :key="index">
        {{ item.name }}项目({{ item.value }})
      </el-radio-button>
    </el-radio-group>
    <!--内容-->
    <div class="mt-4 h-[331px] flex">
      <!--左侧-->
      <div class="w-[32.5%] flex flex-col border-r border-dashed border-r-black-line pr-6">
        <!--标题-->
        <!--				<title-comp title="项目处理进度分布" :type="2"/>-->
        <!--图表-->
        <project-status-distribution-pie style="width: 100%;height: 309px;" :top="105" :legend-click="false"
          :chart-data="projectProgressDistributionChart.list" title="项目进度占比"
          :color-list="projectProgressDistributionChart.colorList" />
      </div>
      <!--右侧-->
      <div class="w-[67.5%] h-full pl-5 flex flex-col">
        <!--标题-->
        <div class="flex justify-between items-center">
          <!--左-->
          <title-comp title="项目列表" :type="2" />
          <!--右-->
          <el-button type="primary" link style="height: auto;padding: 0;" @click="handleViewAll">
            查看全部
            <el-icon class="el-icon--right f-l3"><arrow-right /></el-icon>
          </el-button>
        </div>
        <!--表格-->
        <el-table v-if="type === projectProgressDistributionTypeList[0].name"
          :data="projectProgressDistributionTypeList[0].list" tooltip-effect="dark" class="mt-[14px]">
          <!--项目名称-->
          <el-table-column label="项目名称" prop="projectName" min-width="150" show-overflow-tooltip>
            <template #default="scope">
              <span class="cursor-pointer hover:text-main" @click="handleView(scope.row)">{{ scope.row?.projectName
              }}</span>
            </template>
          </el-table-column>
          <!--当前环节-->
          <el-table-column label="当前环节" prop="currentStepName" min-width="140">
            <template #default="scope">
              <el-tooltip v-if="scope.row.currentStepName" placement="bottom"
                popper-class="tooltip-76 tooltip-x-14 tooltip-y-12">
                <template #content>
                  <div class="flex flex-col gap-y-2.5">
                    <span v-for="(item, index) in scope.row.currentStepName?.split(/[/;；]/)" :key="index"
                      class="text-white text-sm leading-5">{{ item }}</span>
                  </div>
                </template>
                <span v-if="scope.row.currentStepName" class="hpj-text-hidden">{{ scope.row?.currentStepName ||
                  '-' }}</span>
              </el-tooltip>
              <span v-else class="hpj-text-hidden">{{ scope.row?.currentStepName || '-' }}</span>
            </template>
          </el-table-column>
          <!--预计到达时间-->
          <!--					<el-table-column label="预计到达时间" width="190">-->
          <!--						<template #default="scope">-->
          <!--							<div class="w-[160px] flex justify-center items-center py-1 rounded-2xl"-->
          <!--							     :class="[-->
          <!--														 (scope.row.dayNum >= 7 && !(scope.row.stepStatus == 4)) ? 'bg-green-light' : '',-->
          <!--														 (scope.row.dayNum < 7 && !(scope.row.stepStatus == 4)) ? 'bg-yellow-light' : '',-->
          <!--														 ((scope.row.stepStatus == 4)) ? 'bg-red-light' : '',-->
          <!--						               ]">-->
          <!--								&lt;!&ndash;正常推进&ndash;&gt;-->
          <!--								<div v-if="(scope.row.dayNum >= 7 && !(scope.row.stepStatus == 4))"-->
          <!--								     class="flex items-center gap-1.5">-->
          <!--									<span class="text-[#757575]">预计到达时间:</span>-->
          <!--									<span class="text-green ddin-n text-xl font-bold">{{scope.row.dayNum}}</span>-->
          <!--									<span class="text-[#757575]">天</span>-->
          <!--								</div>-->
          <!--								&lt;!&ndash;即将延期&ndash;&gt;-->
          <!--								<div v-if="(scope.row.dayNum < 7 && !(scope.row.stepStatus == 4))"-->
          <!--								     class="flex items-center gap-1.5">-->
          <!--									<span class="text-[#757575]">预计到达时间:</span>-->
          <!--									<span class="text-yellow ddin-n text-xl font-bold">{{scope.row.dayNum}}</span>-->
          <!--									<span class="text-[#757575]">天</span>-->
          <!--								</div>-->
          <!--								&lt;!&ndash;已延期&ndash;&gt;-->
          <!--								<div v-if="((scope.row.stepStatus == 4))"-->
          <!--								     class="flex items-center gap-1.5">-->
          <!--									<span class="text-[#757575]">已延期:</span>-->
          <!--									<span class="text-red ddin-n text-xl font-bold">{{scope.row.dayNum}}</span>-->
          <!--									<span class="text-[#757575]">天</span>-->
          <!--								</div>-->
          <!--							</div>-->
          <!--						</template>-->
          <!--					</el-table-column>-->
        </el-table>
        <el-table v-if="type === projectProgressDistributionTypeList[1].name"
          :data="projectProgressDistributionTypeList[1].list" tooltip-effect="dark" class="mt-[14px]">
          <!--项目名称-->
          <el-table-column label="项目名称" prop="projectName" min-width="150" show-overflow-tooltip>
            <template #default="scope">
              <span class="cursor-pointer hover:text-main" @click="handleView(scope.row)">{{ scope.row?.projectName
              }}</span>
            </template>
          </el-table-column>
          <!--当前环节-->
          <el-table-column label="当前环节" prop="currentStepName" min-width="140">
            <template #default="scope">
              <el-tooltip v-if="scope.row.currentStepName" placement="bottom"
                popper-class="tooltip-76 tooltip-x-14 tooltip-y-12">
                <template #content>
                  <div class="flex flex-col gap-y-2.5">
                    <span v-for="(item, index) in scope.row.currentStepName?.split(/[/;；]/)" :key="index"
                      class="text-white text-sm leading-5">{{ item }}</span>
                  </div>
                </template>
                <span v-if="scope.row.currentStepName" class="hpj-text-hidden">{{ scope.row?.currentStepName ||
                  '-' }}</span>
              </el-tooltip>
              <span v-else class="hpj-text-hidden">{{ scope.row?.currentStepName || '-' }}</span>
            </template>
          </el-table-column>
          <!--预计结束时间-->
          <!--					<el-table-column label="预计结束时间" width="190">-->
          <!--						<template #default="scope">-->
          <!--							<div class="w-[160px] flex justify-center items-center py-1 rounded-2xl"-->
          <!--							     :class="[-->
          <!--														 (scope.row.dayNum >= 7 && !(scope.row.stepStatus == 4)) ? 'bg-green-light' : '',-->
          <!--														 (scope.row.dayNum < 7 && !(scope.row.stepStatus == 4)) ? 'bg-yellow-light' : '',-->
          <!--														 ((scope.row.stepStatus == 4)) ? 'bg-red-light' : '',-->
          <!--						               ]">-->
          <!--								&lt;!&ndash;正常推进&ndash;&gt;-->
          <!--								<div v-if="(scope.row.dayNum >= 7 && !(scope.row.stepStatus == 4))"-->
          <!--								     class="flex items-center gap-1.5">-->
          <!--									<span class="text-[#757575]">预计结束时间:</span>-->
          <!--									<span class="text-green ddin-n text-xl font-bold">{{scope.row.dayNum}}</span>-->
          <!--									<span class="text-[#757575]">天</span>-->
          <!--								</div>-->
          <!--								&lt;!&ndash;即将延期&ndash;&gt;-->
          <!--								<div v-if="(scope.row.dayNum < 7 && !(scope.row.stepStatus == 4))"-->
          <!--								     class="flex items-center gap-1.5">-->
          <!--									<span class="text-[#757575]">预计结束时间:</span>-->
          <!--									<span class="text-yellow ddin-n text-xl font-bold">{{scope.row.dayNum}}</span>-->
          <!--									<span class="text-[#757575]">天</span>-->
          <!--								</div>-->
          <!--								&lt;!&ndash;已延期&ndash;&gt;-->
          <!--								<div v-if="((scope.row.stepStatus == 4))"-->
          <!--								     class="flex items-center gap-1.5">-->
          <!--									<span class="text-[#757575]">已延期:</span>-->
          <!--									<span class="text-red ddin-n text-xl font-bold">{{scope.row.dayNum}}</span>-->
          <!--									<span class="text-[#757575]">天</span>-->
          <!--								</div>-->
          <!--							</div>-->
          <!--						</template>-->
          <!--					</el-table-column>-->
        </el-table>
        <el-table v-if="type === projectProgressDistributionTypeList[2].name"
          :data="projectProgressDistributionTypeList[2].list" tooltip-effect="dark" class="mt-[14px]">
          <!--项目名称-->
          <el-table-column label="项目名称" prop="projectName" min-width="150" show-overflow-tooltip>
            <template #default="scope">
              <span class="cursor-pointer hover:text-main" @click="handleView(scope.row)">{{ scope.row?.projectName
              }}</span>
            </template>
          </el-table-column>
          <!--当前环节-->
          <el-table-column label="当前环节" prop="currentStepName" min-width="140">
            <template #default="scope">
              <el-tooltip v-if="scope.row.currentStepName" placement="bottom"
                popper-class="tooltip-76 tooltip-x-14 tooltip-y-12">
                <template #content>
                  <div class="flex flex-col gap-y-2.5">
                    <span v-for="(item, index) in scope.row.currentStepName?.split(/[/;；]/)" :key="index"
                      class="text-white text-sm leading-5">{{ item }}</span>
                  </div>
                </template>
                <span v-if="scope.row.currentStepName" class="hpj-text-hidden">{{ scope.row?.currentStepName ||
                  '-' }}</span>
              </el-tooltip>
              <span v-else class="hpj-text-hidden">{{ scope.row?.currentStepName || '-' }}</span>
            </template>
          </el-table-column>
          <!--处理完成日期-->
          <el-table-column label="处理完成日期" prop="stepEndTime" width="190" show-overflow-tooltip>
            <template #default="scope">
              <span class="text-black ddin-n text-base leading-[17px]">{{ scope.row.stepEndTime }}</span>
            </template>
          </el-table-column>
          <!--					<el-table-column label="处理完成日期" width="190">-->
          <!--						<template #default="scope">-->
          <!--							<div class="w-[160px] flex justify-center items-center py-1 rounded-2xl"-->
          <!--							     :class="[-->
          <!--														 (scope.row.dayNum >= 7 && !(scope.row.stepStatus == 4)) ? 'bg-green-light' : '',-->
          <!--														 (scope.row.dayNum < 7 && !(scope.row.stepStatus == 4)) ? 'bg-yellow-light' : '',-->
          <!--														 ((scope.row.stepStatus == 4)) ? 'bg-red-light' : '',-->
          <!--						               ]">-->
          <!--								&lt;!&ndash;正常推进&ndash;&gt;-->
          <!--								<div v-if="(scope.row.dayNum >= 7 && !(scope.row.stepStatus == 4))"-->
          <!--								     class="flex items-center gap-1.5">-->
          <!--									<span class="text-[#757575]">处理完成日期:</span>-->
          <!--									<span class="text-green ddin-n text-xl font-bold">{{scope.row.dayNum}}</span>-->
          <!--									<span class="text-[#757575]">天</span>-->
          <!--								</div>-->
          <!--								&lt;!&ndash;即将延期&ndash;&gt;-->
          <!--								<div v-if="(scope.row.dayNum < 7 && !(scope.row.stepStatus == 4))"-->
          <!--								     class="flex items-center gap-1.5">-->
          <!--									<span class="text-[#757575]">处理完成日期:</span>-->
          <!--									<span class="text-yellow ddin-n text-xl font-bold">{{scope.row.dayNum}}</span>-->
          <!--									<span class="text-[#757575]">天</span>-->
          <!--								</div>-->
          <!--								&lt;!&ndash;已延期&ndash;&gt;-->
          <!--								<div v-if="((scope.row.stepStatus == 4))"-->
          <!--								     class="flex items-center gap-1.5">-->
          <!--									<span class="text-[#757575]">已延期:</span>-->
          <!--									<span class="text-red ddin-n text-xl font-bold">{{scope.row.dayNum}}</span>-->
          <!--									<span class="text-[#757575]">天</span>-->
          <!--								</div>-->
          <!--							</div>-->
          <!--						</template>-->
          <!--					</el-table-column>-->
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import TitleComp from "@/views/index/components/TitleComp";
import ProjectStatusDistributionPie from "@/views/index/components/ProjectStatusDistributionPie";
import mixinList from "@/views/index/mixin/mixinList";
import { projectHandleScheduleDistributionMap } from "@/views/index/static";

export default {
  name: 'ProjectProgressDistribution',
  mixins: [
    mixinList,
  ],
  components: {
    TitleComp,
    ProjectStatusDistributionPie,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  watch: {
    data() {
      this.getData();
    },
  },
  data() {
    return {
      // 项目处理进度分布
      type: '即将处理',
      projectProgressDistributionTypeList: [
        {
          name: '即将处理',
          value: 0,
          list: [],
        },
        {
          name: '正在处理',
          value: 0,
          list: [],
        },
        {
          name: '已处理',
          value: 0,
          list: [],
        },
      ],
      projectProgressDistributionChart: {
        list: [
          { value: 0, name: '即将处理', percent: 0, },
          { value: 0, name: '正在处理', percent: 0, },
          { value: 0, name: '已处理', percent: 0, },
        ],
        // colorList: ['#68CD44', '#02ADEC', '#B7C1C5'],
        colorList: ['#FAB752', '#68CD44', '#B7C1C5'],
      },
    };
  },
  created() {
    // this.getFalseData();
    this.getData();
  },
  methods: {
    getData() {
      this.projectProgressDistributionTypeList[0].list = this.data?.upcomingProjectList || [];
      this.projectProgressDistributionTypeList[0].value = this.data?.upcomingProjectNum || 0;
      this.projectProgressDistributionTypeList[1].list = this.data?.processingProjectList || [];
      this.projectProgressDistributionTypeList[1].value = this.data?.processingProjectNum || 0;
      this.projectProgressDistributionTypeList[2].list = this.data?.processedProjectList || [];
      this.projectProgressDistributionTypeList[2].value = this.data?.processedProjectNum || 0;
      // 图表数据
      this.projectProgressDistributionChart.list[0].value = this.data?.upcomingProjectNum || 0;
      this.projectProgressDistributionChart.list[1].value = this.data?.processingProjectNum || 0;
      this.projectProgressDistributionChart.list[2].value = this.data?.processedProjectNum || 0;

      this.projectProgressDistributionChart.list[0].percent = this.data?.upcomingProjectPercent || 0;
      this.projectProgressDistributionChart.list[1].percent = this.data?.processingProjectPercent || 0;
      this.projectProgressDistributionChart.list[2].percent = this.data?.processedProjectPercent || 0;
    },
    getFalseData() {
      // 静态数据
      this.projectProgressDistributionTypeList[0].list = [
        {
          // 项目名称
          projectName: '技术服务中心项目',
          // 当前环节
          currentStepName: '土地储备>边界确认单（储备）',
          // 是否延期
          isDelay: false,
          // 预计到达时间
          dayNum: 2,
          stepEndTime: '2021-08-01',
        },
        {
          // 项目名称
          projectName: '尼龙66一体化项目',
          // 当前环节
          currentStepName: '土地储备>规土意见书（储备）',
          // 是否延期
          isDelay: false,
          // 预计到达时间
          dayNum: 20,
          stepEndTime: '2021-08-01',
        },
        {
          // 项目名称
          projectName: '贺利氏电子化学品新建项目',
          // 当前环节
          currentStepName: '土地供应>设计方案审批（含提前征询)',
          // 是否延期
          isDelay: false,
          // 预计到达时间
          dayNum: 20,
          stepEndTime: '2021-08-01',
        },
        {
          // 项目名称
          projectName: '先进电子材料基地项目',
          // 当前环节
          currentStepName: '土地供应>“两图一表”审核',
          // 是否延期
          isDelay: true,
          // 预计到达时间
          dayNum: 20,
          stepEndTime: '2021-08-01',
        },
        {
          // 项目名称
          projectName: '昇合建物天然产物生物制造示范项目',
          // 当前环节
          currentStepName: '前期审批>环评影响评价审查',
          // 是否延期
          isDelay: false,
          // 预计到达时间
          dayNum: 20,
          stepEndTime: '2021-08-01',
        },
      ];
      this.projectProgressDistributionTypeList[0].value = 49;
      this.projectProgressDistributionTypeList[1].list = [
        {
          // 项目名称
          projectName: '技术服务中心项目',
          // 当前环节
          currentStepName: '土地储备>边界确认单（储备）',
          // 是否延期
          isDelay: false,
          // 预计到达时间
          dayNum: 2,
        },
        {
          // 项目名称
          projectName: '尼龙66一体化项目',
          // 当前环节
          currentStepName: '土地储备>规土意见书（储备）',
          // 是否延期
          isDelay: false,
          // 预计到达时间
          dayNum: 20,
        },
        {
          // 项目名称
          projectName: '贺利氏电子化学品新建项目',
          // 当前环节
          currentStepName: '土地供应>设计方案审批（含提前征询)',
          // 是否延期
          isDelay: false,
          // 预计到达时间
          dayNum: 20,
        },
        {
          // 项目名称
          projectName: '先进电子材料基地项目',
          // 当前环节
          currentStepName: '土地供应>“两图一表”审核',
          // 是否延期
          isDelay: true,
          // 预计到达时间
          dayNum: 20,
        },
        {
          // 项目名称
          projectName: '昇合建物天然产物生物制造示范项目',
          // 当前环节
          currentStepName: '前期审批>环评影响评价审查',
          // 是否延期
          isDelay: false,
          // 预计到达时间
          dayNum: 20,
        },
      ];
      this.projectProgressDistributionTypeList[1].value = 21;
      this.projectProgressDistributionTypeList[2].list = [
        {
          // 项目名称
          projectName: '技术服务中心项目',
          // 当前环节
          currentStepName: '土地储备>边界确认单（储备）',
          // 是否延期
          isDelay: false,
          // 预计到达时间
          dayNum: 20,
          stepEndTime: '2021-08-01',
        },
        {
          // 项目名称
          projectName: '尼龙66一体化项目',
          // 当前环节
          currentStepName: '土地储备>规土意见书（储备）',
          // 是否延期
          isDelay: false,
          // 预计到达时间
          dayNum: 20,
          stepEndTime: '2021-08-01',
        },
        {
          // 项目名称
          projectName: '贺利氏电子化学品新建项目',
          // 当前环节
          currentStepName: '土地供应>设计方案审批（含提前征询)',
          // 是否延期
          isDelay: false,
          // 预计到达时间
          dayNum: 20,
          stepEndTime: '2021-08-01',
        },
        {
          // 项目名称
          projectName: '先进电子材料基地项目',
          // 当前环节
          currentStepName: '土地供应>“两图一表”审核',
          // 是否延期
          isDelay: false,
          // 预计到达时间
          dayNum: 20,
          stepEndTime: '2021-08-01',
        },
        {
          // 项目名称
          projectName: '昇合建物天然产物生物制造示范项目',
          // 当前环节
          currentStepName: '前期审批>环评影响评价审查',
          // 是否延期
          isDelay: false,
          // 预计到达时间
          dayNum: 20,
          stepEndTime: '2021-08-01',
        },
      ];
      this.projectProgressDistributionTypeList[2].value = 9;
      // 图表数据
      this.projectProgressDistributionChart.list[0].value = 15;
      this.projectProgressDistributionChart.list[1].value = 18;
      this.projectProgressDistributionChart.list[2].value = 32;
    },
    handleViewAll() {
      this.$router.push({
        name: 'ProjectList',
        state: {
          params: {
            // 项目处理进度分布
            projectHandleCode: projectHandleScheduleDistributionMap[this.type],
          },
        },
      });
    },
  },
};
</script>

<style lang="scss">
.project-progress-distribution {
  .el-table td.el-table__cell {
    height: 50px;
  }
}
</style>
