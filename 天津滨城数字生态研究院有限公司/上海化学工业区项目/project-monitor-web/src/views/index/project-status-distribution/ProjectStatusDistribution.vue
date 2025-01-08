<template>
  <!--项目状态分布-->
  <div v-if="!onlyChart" class="project-status-distribution px-5 flex flex-col bg-white text-sm" v-loading="loading"
    :style="{
      borderRadius: source === 'index' ? '16px' : '0 16px 16px 16px',
      height: showType === 'horizontal' ? '411px' : 'auto',
      boxShadow: source === 'index' ? '3px 0px 8px rgba(17, 35, 41, 0.09)' : '',
    }">
    <!--标题-->
    <el-radio-group v-if="source === 'index'" class="ee-radio-group" v-model="projectType">
      <el-radio-button v-for="(item, index) in projectTypeList" :label="item.name" :key="index">
        {{ item.name }}({{ item.value }})
      </el-radio-button>
    </el-radio-group>
    <!--新标题组件-->
    <menu-list-with-line v-if="source === 'analysis'" v-model:project-type="projectType" :list="projectTypeList" />
    <!--内容-->
    <div v-if="showType === 'horizontal'" class="mt-4 h-[331px] flex">
      <!--左侧-->
      <div class="w-[32.5%] flex flex-col border-r border-dashed border-r-black-line pr-6">
        <!--标题-->
        <title-comp :title="titleName" :type="2" />
        <!--图表-->
        <project-status-distribution-pie style="width: 100%;height: 309px;" ref="chart" :legend-type="1"
          :chart-data="chart.list" :title="titleName" :color-list="chart.colorList1" @change="change" />
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
        <el-table :data="list" tooltip-effect="dark" class="mt-[14px]">
          <!--项目名称,请编写实现代码-->
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
          <!--受理/经办部门-->
          <el-table-column label="受理/经办部门" prop="acceptDept" min-width="140">
            <template #default="scope">
              <el-tooltip v-if="scope.row.acceptDept" placement="bottom"
                popper-class="tooltip-76 tooltip-x-14 tooltip-y-12">
                <template #content>
                  <div class="flex flex-col gap-y-2.5">
                    <span v-for="(item, index) in scope.row.acceptDept?.split(/[/;；]/)" :key="index"
                      class="text-white text-sm leading-5">{{ item }}</span>
                  </div>
                </template>
                <span v-if="scope.row.acceptDept" class="hpj-text-hidden">{{ scope.row?.acceptDept || '-' }}</span>
              </el-tooltip>
              <span v-else class="hpj-text-hidden">{{ scope.row?.acceptDept || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="terminalDate" label="终止时间" width="100" show-overflow-tooltip>
            <template v-slot="sc">
              <span v-if="sc.row.terminalDate" class="ddin-n f16">{{ sc.row.terminalDate }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <!--时间预警-->
          <!--					<el-table-column label="时间预警" prop="dayNum" width="190">-->
          <!--						<template #default="scope">-->
          <!--							<div class="w-[160px] flex justify-center items-center py-1 rounded-2xl"-->
          <!--							     :class="[-->
          <!--														 scope.row.projectStatus === projectStatusMap['正常推进'] ? 'bg-green-light' : '',-->
          <!--														 scope.row.projectStatus === projectStatusMap['已终止'] ? 'bg-[#F8F9F9]' : '',-->
          <!--														 scope.row.projectStatus === projectStatusMap['即将延期'] ? 'bg-yellow-light' : '',-->
          <!--														 scope.row.projectStatus === projectStatusMap['已延期'] ? 'bg-red-light' : '',-->
          <!--						               ]">-->
          <!--								&lt;!&ndash;正常推进&ndash;&gt;-->
          <!--								<div v-if="scope.row.projectStatus === projectStatusMap['正常推进']"-->
          <!--								     class="flex items-center gap-1.5">-->
          <!--									<span class="text-[#757575]">预期结束还有:</span>-->
          <!--									<span class="text-green ddin-n text-xl font-bold">{{scope.row.dayNum}}</span>-->
          <!--									<span class="text-[#757575]">天</span>-->
          <!--								</div>-->
          <!--								&lt;!&ndash;已终止&ndash;&gt;-->
          <!--								<div v-if="scope.row.projectStatus === projectStatusMap['已终止']"-->
          <!--								     class="flex items-center gap-1.5 text-[#757575] leading-[23px]">-->
          <!--									<span class="text-sm leading-[23px]">终止时间:</span>-->
          <!--									<span class="ddin-n text-base leading-[23px]">{{scope.row.terminalDate}}</span>-->
          <!--								</div>-->
          <!--								&lt;!&ndash;即将延期&ndash;&gt;-->
          <!--								<div v-if="scope.row.projectStatus === projectStatusMap['即将延期']"-->
          <!--								     class="flex items-center gap-1.5">-->
          <!--									<span class="text-[#757575]">预期结束还有:</span>-->
          <!--									<span class="text-yellow ddin-n text-xl font-bold">{{scope.row.dayNum}}</span>-->
          <!--									<span class="text-[#757575]">天</span>-->
          <!--								</div>-->
          <!--								&lt;!&ndash;已延期&ndash;&gt;-->
          <!--								<div v-if="scope.row.projectStatus === projectStatusMap['已延期']"-->
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
    <!--垂直方式-->
    <div v-if="showType === 'vertical'" class="mt-5 flex flex-col">
      <!--上-->
      <div class="flex flex-col">
        <!--标题-->
        <title-comp :title="titleName" :type="2" />
        <!--图表-->
        <project-status-distribution-pie class="picture" style="width: 100%;height: 290px;" ref="chart" :legend-type="2"
          :chart-data="chart.list" :title="titleName" :color-list="chart.colorList2" innerLabelType="2" :total="total"
          @change="change" />
      </div>
      <!--下-->
      <div class="flex flex-col border-t border-dashed border-black-line pt-3.5">
        <!--标题-->
        <div class="flex justify-between items-center">
          <!--左-->
          <selected-condition :label="titleName" :have-value="selectedStatus !== null" @clear-condition="clearCondition">
            <template #content>
              <div class="flex items-center select-none">
                <span class="text-main">{{ selectedStatus }}</span>
              </div>
            </template>
          </selected-condition>
          <!--右-->
          <el-button type="primary" link style="height: auto;padding: 0;" @click="handleViewAll">
            查看全部
            <svg-icon class="el-icon--right" icon-class="arrow-right" width="14px" height="14px"
              color="rgba(0,0,0,0.25)" />
          </el-button>
        </div>
        <!--表格-->
        <el-table :data="list" tooltip-effect="dark" class="mt-2.5">
          <!--项目名称,请编写实现代码-->
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
          <!--受理/经办部门-->
          <el-table-column label="受理/经办部门" prop="acceptDept" min-width="140">
            <template #default="scope">
              <el-tooltip v-if="scope.row.acceptDept" placement="bottom"
                popper-class="tooltip-76 tooltip-x-14 tooltip-y-12">
                <template #content>
                  <div class="flex flex-col gap-y-2.5">
                    <span v-for="(item, index) in scope.row.acceptDept?.split(/[/;；]/)" :key="index"
                      class="text-white text-sm leading-5">{{ item }}</span>
                  </div>
                </template>
                <span v-if="scope.row.acceptDept" class="hpj-text-hidden">{{ scope.row?.acceptDept || '-' }}</span>
              </el-tooltip>
              <span v-else class="hpj-text-hidden">{{ scope.row?.acceptDept || '-' }}</span>
            </template>
          </el-table-column>
          <!--时间预警-->
          <!--					<el-table-column label="时间预警" prop="dayNum" width="190">-->
          <!--						<template #default="scope">-->
          <!--							<div class="w-[160px] flex justify-center items-center py-1 rounded-2xl"-->
          <!--							     :class="[-->
          <!--														 scope.row.projectStatus === projectStatusMap['正常推进'] ? 'bg-green-light' : '',-->
          <!--														 scope.row.projectStatus === projectStatusMap['已终止'] ? 'bg-[#F8F9F9]' : '',-->
          <!--														 scope.row.projectStatus === projectStatusMap['即将延期'] ? 'bg-yellow-light' : '',-->
          <!--														 scope.row.projectStatus === projectStatusMap['已延期'] ? 'bg-red-light' : '',-->
          <!--						               ]">-->
          <!--								&lt;!&ndash;正常推进&ndash;&gt;-->
          <!--								<div v-if="scope.row.projectStatus === projectStatusMap['正常推进']"-->
          <!--								     class="flex items-center gap-1.5">-->
          <!--									<span class="text-[#757575]">预期结束还有:</span>-->
          <!--									<span class="text-green ddin-n text-xl font-bold">{{scope.row.dayNum}}</span>-->
          <!--									<span class="text-[#757575]">天</span>-->
          <!--								</div>-->
          <!--								&lt;!&ndash;已终止&ndash;&gt;-->
          <!--								<div v-if="scope.row.projectStatus === projectStatusMap['已终止']"-->
          <!--								     class="flex items-center gap-1.5 text-[#757575] leading-[23px]">-->
          <!--									<span class="text-sm leading-[23px]">终止时间:</span>-->
          <!--									<span class="ddin-n text-base leading-[23px]">{{scope.row.terminalDate}}</span>-->
          <!--								</div>-->
          <!--								&lt;!&ndash;即将延期&ndash;&gt;-->
          <!--								<div v-if="scope.row.projectStatus === projectStatusMap['即将延期']"-->
          <!--								     class="flex items-center gap-1.5">-->
          <!--									<span class="text-[#757575]">预期结束还有:</span>-->
          <!--									<span class="text-yellow ddin-n text-xl font-bold">{{scope.row.dayNum}}</span>-->
          <!--									<span class="text-[#757575]">天</span>-->
          <!--								</div>-->
          <!--								&lt;!&ndash;已延期&ndash;&gt;-->
          <!--								<div v-if="scope.row.projectStatus === projectStatusMap['已延期']"-->
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
  <!--仅图表-->
  <div v-else>
    <project-status-distribution-pie class="picture1" style="width: 100%;height: 290px;" ref="chart" :legend-type="2"
      :chart-data="chart.list" :title="titleName" :color-list="chart.colorList2" @change="change" />
  </div>
</template>

<script>
import TitleComp from "@/views/index/components/TitleComp";
import ProjectStatusDistributionPie from "@/views/index/components/ProjectStatusDistributionPie";
import mixinList from "@/views/index/mixin/mixinList";
import { ruProjectBaseinfo_projectStatus } from "@/api/pm/ruProjectBaseinfo";
import { projectStatusMap, projectTypeMap } from "@/views/index/static";
import MenuListWithLine from "@/views/analysis/components/MenuListWithLine.vue";
import SelectedCondition from "@/views/analysis/components/SelectedCondition.vue";

export default {
  name: 'ProjectStatusDistribution',
  props: {
    // 所属页面，首页页面index，项目态势页面analysis
    source: {
      type: String,
      required: false,
      default: 'index',
    },
    // 展示方式，垂直vertical，水平horizontal
    showType: {
      type: String,
      required: false,
      default: 'horizontal',
    },
    rangeTime: {
      type: Array,
      required: false,
      default: () => [null, null],
    },
    titleName: {
      type: String,
      required: true,
    },
    onlyChart: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  mixins: [
    mixinList,
  ],
  components: {
    SelectedCondition,
    MenuListWithLine,
    TitleComp,
    ProjectStatusDistributionPie,
  },
  data() {
    return {
      projectTypeMap,
      projectStatusMap,
      loading: false,
      // 选中的状态
      selectedStatus: null,
      list: [],
      total: 0,
      // 项目状态分布
      projectType: '全部',
      projectTypeList: [
        { name: '全部', value: 0 },
        { name: '产业项目', value: 0 },
        { name: '市政项目', value: 0 },
        { name: '路桥项目', value: 0 },
        { name: '公共设施项目', value: 0 },
      ],
      chart: {
        list: [
          { value: 0, name: '正常推进', prompt: '项目当前环节状态为“正常推进”或“已暂停”，且进度还未到达80%', percent: 0, },
          // { value: 0, name: '即将延期', prompt: '项目当前环节进度已到达80%，状态还未变更为“已完成”或“已暂停”，项目状态为“即将延期”', percent: 0,},
          { value: 0, name: '已延期', prompt: '项目当前环节环节状态变更为“已延期”，则项目状态为“已延期”', percent: 0, },
          { value: 0, name: '已终止', prompt: '手动进行【项目终止】操作', percent: 0, },
        ],
        // colorList1: ['#68CD44', '#FAB752', '#E85050', '#B7C1C5'],
        // colorList2: [{
        // 	text: '#68CD44',
        // 	light: '#F0FAEC',
        // }, {
        // 	text: '#FAB752',
        // 	light: '#FEF8EE',
        // }, {
        // 	text: '#E85050',
        // 	light: '#FDEDED',
        // }, {
        // 	text: '#B7C1C5',
        // 	light: '#F8F9F9',
        // }],
        colorList1: ['#68CD44', '#E85050', '#B7C1C5'],
        colorList2: [{
          text: '#68CD44',
          light: '#F0FAEC',
        }, {
          text: '#E85050',
          light: '#FDEDED',
        }, {
          text: '#B7C1C5',
          light: '#F8F9F9',
        }],
      },
    };
  },
  watch: {
    rangeTime(val) {
      this.projectType = '全部';
      this.selectedStatus = null;
      this.$refs.chart.init();
      this.getData();
    },
    projectType(val) {
      this.selectedStatus = null;
      this.$refs.chart.init();
      this.getData();
    },
  },
  created() {
    this.getData();
  },
  methods: {
    clearCondition() {
      this.selectedStatus = null;
      this.$refs.chart.init();
      this.getData();
    },
    async getFalseData() {
      return new Promise((resolve) => {
        setTimeout(() => {
          const res = {
            result: {
              // 项目类型分布
              allProjectNum: 49,
              industryProjectNum: 21,
              municipalProjectNum: 5,
              bridgeProjectNum: 16,
              facilityProjectNum: 7,
              // 每个类型的项目状态分布
              processingNum: 7,
              delaySoonNum: 15,
              delayAlreadyNum: 18,
              terminatedNum: 9,
              // 项目列表
              projectList: [
                {
                  projectId: '1',
                  projectName: '项目名称1',
                  currentStepName: '项目当前环节名称1',
                  acceptDept: '受理部门1',
                  projectStatus: '1',// 正常推进
                  dayNum: 3,
                },
                {
                  projectId: '2',
                  projectName: '项目名称2',
                  currentStepName: '项目当前环节名称2',
                  acceptDept: '受理部门2',
                  projectStatus: '2',// 即将延期
                  dayNum: 4,
                },
                {
                  projectId: '3',
                  projectName: '项目名称3',
                  currentStepName: '项目当前环节名称3',
                  acceptDept: '受理部门3',
                  projectStatus: '3',// 已延期
                  dayNum: 5,
                },
                {
                  projectId: '4',
                  projectName: '项目名称4',
                  currentStepName: '项目当前环节名称4',
                  acceptDept: '受理部门4',
                  projectStatus: '4',// 已终止
                  dayNum: 6,
                  terminalDate: '2023/01/14',
                },
                {
                  projectId: '5',
                  projectName: '项目名称5',
                  currentStepName: '项目当前环节名称5',
                  acceptDept: '受理部门5',
                  projectStatus: '1',// 正常推进
                  dayNum: 7,
                }
              ],
            },
          }
          resolve(res);
        }, 500);
      })
    },
    change(item) {
      this.selectedStatus = item;
      this.getData();
    },
    async getData() {
      const params = {
        projectType: this.projectType === '全部' ? null : projectTypeMap[this.projectType],
        projectStatus: this.selectedStatus ? projectStatusMap[this.selectedStatus] : null,
        startTime: this.rangeTime[0],
        endTime: this.rangeTime[1],
      };
      this.loading = true;
      const { result } = await ruProjectBaseinfo_projectStatus(params);
      // const {result} = await this.getFalseData(params);
      // 项目类型分布
      this.projectTypeList[0].value = result.allProjectNum;
      this.projectTypeList[1].value = result.industryProjectNum;
      this.projectTypeList[2].value = result.municipalProjectNum;
      this.projectTypeList[3].value = result.bridgeProjectNum;
      this.projectTypeList[4].value = result.facilityProjectNum;
      // 每个类型的项目状态分布
      this.chart.list[0].value = result.processingNum;
      this.chart.list[1].value = result.delayAlreadyNum;
      this.chart.list[2].value = result.terminatedNum;

      this.chart.list[0].percent = result?.processingPercent || 0;
      this.chart.list[1].percent = result?.delayAlreadyPercent || 0;
      this.chart.list[2].percent = result?.terminatedPercent || 0;

      this.list = result.projectList;
      this.total = result[this.projectType === '全部' ? 'allProjectNum' : `${projectTypeMap[this.projectType].split('_')[0]}ProjectNum`]
      this.loading = false;
      // 当图表渲染完成后，发送事件，通知父组件，图表已经渲染完成
      this.$nextTick(() => {
        setTimeout(() => {
          this.$nextTick(() => {
            this.$emit('on-ok');
          });
        }, 2000);
      });
    },
    handleViewAll() {
      this.$router.push({
        name: 'ProjectList',
        state: {
          params: {
            // 项目创建时间
            createTimeBeginTime: this?.rangeTime ? this.rangeTime[0] : null,
            createTimeEndTime: this?.rangeTime ? this.rangeTime[1] : null,
            projectTypeCodeList: this.projectType === '全部' ? null : [projectTypeMap[this.projectType]],
            // 项目状态分布
            projectStatusList: this.selectedStatus ? [projectStatusMap[this.selectedStatus]] : null,
          },
        },
      });
    },
  },
};
</script>

<style lang="scss">
.project-status-distribution {
  .el-table td.el-table__cell {
    height: 50px;
  }
}
</style>
