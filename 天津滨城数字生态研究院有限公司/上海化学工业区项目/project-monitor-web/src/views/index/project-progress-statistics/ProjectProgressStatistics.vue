<template>
  <!--项目阶段分布-->
  <div v-if="!onlyChart" class="project-progress-statistics px-5 flex flex-col bg-white text-sm" v-loading="loading"
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
      <div class="w-[32.5%] min-w-[560px] flex flex-col border-r border-dashed border-r-black-line pr-2.5">
        <!--标题-->
        <title-comp :title="titleName" :type="2" />
        <!--				&lt;!&ndash;图表&ndash;&gt;-->
        <!--				<div class="mt-[14px] w-full flex flex-col">-->
        <!--					<div class="h-[26px] mb-3 flex items-center cursor-pointer rounded-[23px] pl-2.5 pr-3.5"-->
        <!--					     :style="{backgroundColor: index === selectedIndex ? hexToRgba(item.color, 0.1) : null}"-->
        <!--					     v-for="(item, index) in projectProgressStatisticsList"-->
        <!--					     :key="index"-->
        <!--					     @click="handleClick(index)"-->
        <!--					>-->
        <!--						<span class="text-sm leading-[22px]"-->
        <!--						      :style="{color: index === selectedIndex ? item.color : '#4B5666'}">{{item?.period_name}}</span>-->
        <!--						<div class="ml-3 flex-1 h-[8px] relative rounded-[23px]"-->
        <!--						     :style="{backgroundColor: hexToRgba(item.color, 0.16)}">-->
        <!--							<div v-if="projectProgressStatisticsListSum > 0"-->
        <!--							     class="absolute top-0 left-0 h-full rounded-[23px]"-->
        <!--							     :style="{-->
        <!--														backgroundColor: item.color,-->
        <!--														width: item?.value / projectProgressStatisticsListSum * 100 + '%',-->
        <!--													}"-->
        <!--							/>-->
        <!--						</div>-->
        <!--						<span class="w-[28px] flex justify-end items-center ddin text-lg font-bold"-->
        <!--						      :style="{color: index === selectedIndex ? item.color : '#1A262C'}">{{item?.value}}</span>-->
        <!--					</div>-->
        <!--				</div>-->
        <period-small-graph v-model:selected-period="selectedPeriod" :project-type="projectType"
          :data="data"></period-small-graph>
      </div>
      <!--右侧-->
      <div class="w-[67.5%] h-full pl-5 flex flex-col" style="max-width: calc(100% - 560px);">
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
          <!--下一环节-->
          <el-table-column label="下一环节" prop="nextStepName" min-width="140">
            <template #default="scope">
              <el-tooltip v-if="scope.row.nextStepName" placement="bottom"
                popper-class="tooltip-76 tooltip-x-14 tooltip-y-12">
                <template #content>
                  <div class="flex flex-col gap-y-2.5">
                    <span v-for="(item, index) in scope.row.nextStepName?.split(/[/;；]/)" :key="index"
                      class="text-white text-sm leading-5">{{ item }}</span>
                  </div>
                </template>
                <span v-if="scope.row.nextStepName" class="hpj-text-hidden">{{ scope.row?.nextStepName || '-' }}</span>
              </el-tooltip>
              <span v-else class="hpj-text-hidden">{{ scope.row?.nextStepName || '-' }}</span>
            </template>
          </el-table-column>
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
        <!--				<div class="mt-[14px] w-full flex flex-col">-->
        <!--					<div class="h-[26px] mb-3 flex items-center cursor-pointer rounded-[23px] pl-2.5 pr-3.5"-->
        <!--					     :style="{backgroundColor: index === selectedIndex ? hexToRgba(item.color, 0.1) : null}"-->
        <!--					     v-for="(item, index) in projectProgressStatisticsList"-->
        <!--					     :key="index"-->
        <!--					     @click="handleClick(index)"-->
        <!--					>-->
        <!--						<span class="text-sm leading-[22px]"-->
        <!--						      :style="{color: index === selectedIndex ? item.color : '#4B5666'}">{{item?.period_name}}</span>-->
        <!--						<div class="ml-3 flex-1 h-[8px] relative rounded-[23px]"-->
        <!--						     :style="{backgroundColor: hexToRgba(item.color, 0.16)}">-->
        <!--							<div v-if="projectProgressStatisticsListSum > 0"-->
        <!--							     class="absolute top-0 left-0 h-full rounded-[23px]"-->
        <!--							     :style="{-->
        <!--														backgroundColor: item.color,-->
        <!--														width: item?.value / projectProgressStatisticsListSum * 100 + '%',-->
        <!--													}"-->
        <!--							/>-->
        <!--						</div>-->
        <!--						<span class="w-[28px] flex justify-end items-center ddin text-lg font-bold"-->
        <!--						      :style="{color: index === selectedIndex ? item.color : '#1A262C'}">{{item?.value}}</span>-->
        <!--					</div>-->
        <!--				</div>-->
        <!--				<div class="w-full h-[290px] bg-red flex flex-col"></div>-->
        <period-large-graph v-model:selected-period="selectedPeriod" class="picture" :project-type="projectType"
          :data="data"></period-large-graph>
      </div>
      <!--下-->
      <div class="flex flex-col border-t border-dashed border-black-line pt-3.5">
        <!--标题-->
        <div class="flex justify-between items-center">
          <!--左-->
          <selected-condition :label="titleName" :have-value="selectedPeriod !== null && selectedPeriod !== ''"
            @clear-condition="clearCondition">
            <template #content>
              <div class="flex items-center select-none">
                <!--								<span class="text-main">{{// projectProgressStatisticsList[selectedIndex].period_name}}</span>-->
                <span class="text-main">{{ selectedPeriod }}</span>
              </div>
            </template>
          </selected-condition>
          <!--右-->
          <el-button type="primary" link style="height: auto;padding: 0;" @click="handleViewAll">
            查看全部
            <el-icon class="el-icon--right f-l3"><arrow-right /></el-icon>
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
          <!--下一环节-->
          <el-table-column label="下一环节" prop="nextStepName" min-width="140">
            <template #default="scope">
              <el-tooltip v-if="scope.row.nextStepName" placement="bottom"
                popper-class="tooltip-76 tooltip-x-14 tooltip-y-12">
                <template #content>
                  <div class="flex flex-col gap-y-2.5">
                    <span v-for="(item, index) in scope.row.nextStepName?.split(/[/;；]/)" :key="index"
                      class="text-white text-sm leading-5">{{ item }}</span>
                  </div>
                </template>
                <span v-if="scope.row.nextStepName" class="hpj-text-hidden">{{ scope.row?.nextStepName || '-' }}</span>
              </el-tooltip>
              <span v-else class="hpj-text-hidden">{{ scope.row?.nextStepName || '-' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <!--仅图表-->
  <div v-else>
    <period-large-graph v-model:selected-period="selectedPeriod" class="picture2" :project-type="projectType"
      :data="data"></period-large-graph>
  </div>
</template>

<script>
import TitleComp from "@/views/index/components/TitleComp";
import { hexToRgba } from '@/utils/index';
import mixinList from "@/views/index/mixin/mixinList";
import { projectTypeMap } from "@/views/index/static";
import request from "@/utils/request";
import MenuListWithLine from "@/views/analysis/components/MenuListWithLine.vue";
import SelectedCondition from "@/views/analysis/components/SelectedCondition.vue";
import PeriodSmallGraph from "@/views/index/components/period-small-graph/PeriodSmallGraph.vue";
import PeriodLargeGraph from "@/views/index/components/period-large-graph/PeriodLargeGraph.vue";

export default {
  name: 'ProjectProgressStatistics',
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
    PeriodLargeGraph,
    PeriodSmallGraph,
    SelectedCondition,
    MenuListWithLine,
    TitleComp,
  },
  data() {
    return {
      loading: false,
      list: [],
      // 项目阶段分布
      projectType: '全部',
      projectTypeList: [
        { name: '全部', value: 0 },
        { name: '产业项目', value: 0 },
        { name: '市政项目', value: 0 },
        { name: '路桥项目', value: 0 },
        { name: '公共设施项目', value: 0 },
      ],
      // 产业项目
      list1: [
        {
          period_id: ['10001',],
          period_name: '项目准入',
          value: 0,
          color: '#436FF6',
        },
        {
          period_id: ['10002',],
          period_name: '土地储备',
          value: 0,
          color: '#02ADEC',
        },
        {
          period_id: ['10003',],
          period_name: '土地供应',
          value: 0,
          color: '#74CBF6',
        },
        {
          period_id: ['10004',],
          period_name: '前期审批',
          value: 0,
          color: '#9BA2E2',
        },
        {
          period_id: ['10005',],
          period_name: '项目建设',
          value: 0,
          color: '#85B8E6',
        },
        {
          period_id: ['10006',],
          period_name: '绩效监管',
          value: 0,
          color: '#8FE7E1',
        },
      ],
      // 其它项目
      list2: [
        {
          period_id: ['10007',],
          period_name: '项目决策',
          value: 0,
          color: '#6D8EE4',
        },
        {
          period_id: ['10008',],
          period_name: '土地储备',
          value: 0,
          color: '#02ADEC',
        },
        {
          period_id: ['10009',],
          period_name: '土地供应',
          value: 0,
          color: '#74CBF6',
        },
        {
          period_id: ['10010',],
          period_name: '前期审批',
          value: 0,
          color: '#9BA2E2',
        },
        {
          period_id: ['10011',],
          period_name: '项目建设',
          value: 0,
          color: '#85B8E6',
        },
        {
          period_id: ['10012',],
          period_name: '运行维护',
          value: 0,
          color: '#92E3A4',
        },
      ],
      // 全部
      allList: [
        {
          period_id: ['10001',],
          period_name: '项目准入',
          value: 0,
          color: '#436FF6',
        },
        {
          period_id: ['10007',],
          period_name: '项目决策',
          value: 0,
          color: '#6D8EE4',
        },
        {
          period_id: ['10002', '10008',],
          period_name: '土地储备',
          value: 0,
          color: '#02ADEC',
        },
        {
          period_id: ['10003', '10009',],
          period_name: '土地供应',
          value: 0,
          color: '#74CBF6',
        },
        {
          period_id: ['10004', '10010',],
          period_name: '前期审批',
          value: 0,
          color: '#9BA2E2',
        },
        {
          period_id: ['10005', '10011',],
          period_name: '项目建设',
          value: 0,
          color: '#85B8E6',
        },
        {
          period_id: ['10006',],
          period_name: '绩效监管',
          value: 0,
          color: '#8FE7E1',
        },
        {
          period_id: ['10012',],
          period_name: '运行维护',
          value: 0,
          color: '#92E3A4',
        },
      ],
      // 选中的图例
      selectedIndex: null,
      selectedPeriod: '',
      data: {
        sum: 0,
        period: {
          '项目准入': {
            value: 0,
            percent: 0,
          },
          '项目决策': {
            value: 0,
            percent: 0,
          },
          '土地储备': {
            value: 0,
            percent: 0,
          },
          '土地供应': {
            value: 0,
            percent: 0,
          },
          '前期审批': {
            value: 0,
            percent: 0,
          },
          '项目建设': {
            value: 0,
            percent: 0,
          },
          '绩效监管': {
            value: 0,
            percent: 0,
          },
          '运行维护': {
            value: 0,
            percent: 0,
          },
        },
      },
    };
  },
  computed: {
    projectProgressStatisticsListSum() {
      return this.projectProgressStatisticsList.reduce((total, item) => {
        return total + item.value;
      }, 0);
    },
    // projectProgressStatisticsList() {
    // 	if (this.projectType === '全部') {
    // 		return this.allList;
    // 	} else if (this.projectType === '产业项目') {
    // 		// 将projectProgressList赋值为projectProgressAllList的特定项，规则为不包含['项目决策', '运行维护']
    // 		return this.allList.filter(item => {
    // 			return !['项目决策', '运行维护'].includes(item.name);
    // 		});
    // 	} else {
    // 		// 将projectProgressList赋值为projectProgressAllList的特定项，规则为不包含['项目准入', '绩效监管']
    // 		return this.allList.filter(item => {
    // 			return !['项目准入', '绩效监管'].includes(item.name);
    // 		});
    // 	}
    // },
    projectProgressStatisticsList() {
      if (this.projectType === '全部') {
        return this.allList;
      } else if (this.projectType === '产业项目') {
        return this.list1;
      } else {
        return this.list2;
      }
    },
    typeMap() {
      if (this.projectType === '全部') {
        return {
          '项目准入': ['10001',],
          '项目决策': ['10007',],
          '土地储备': ['10002', '10008',],
          '土地供应': ['10003', '10009',],
          '前期审批': ['10004', '10010',],
          '项目建设': ['10005', '10011',],
          '绩效监管': ['10006',],
          '运行维护': ['10012',],
        }
      } else if (this.projectType === '产业项目') {
        return {
          '项目准入': ['10001',],
          '土地储备': ['10002',],
          '土地供应': ['10003',],
          '前期审批': ['10004',],
          '项目建设': ['10005',],
          '绩效监管': ['10006',],
        }
      } else {
        return {
          '项目决策': ['10007',],
          '土地储备': ['10008',],
          '土地供应': ['10009',],
          '前期审批': ['10010',],
          '项目建设': ['10011',],
          '运行维护': ['10012',],
        }
      }
    },
  },
  watch: {
    rangeTime(value) {
      this.projectType = '全部';
      this.selectedIndex = null;
      this.selectedPeriod = '';
      this.getData();
    },
    projectType(value) {
      this.selectedIndex = null;
      this.selectedPeriod = '';
      this.getData();
    },
    selectedPeriod() {
      this.getData();
    },
  },
  created() {
    this.getData();
  },
  methods: {
    hexToRgba,
    clearCondition() {
      this.selectedIndex = null;
      this.selectedPeriod = '';
      this.getData();
    },
    handleClick(index) {
      this.selectedIndex = (this.selectedIndex !== index) ? index : null;
      this.getData();
    },
    async getFalseData(params) {
      console.log('params', params);
      return new Promise((resolve) => {
        setTimeout(() => {
          let object = {}
          if (params.projectType == null) {
            object = {
              // 项目阶段分布
              projectAccessNum: 12,// 项目准入
              projectDecisionNum: 10,// 项目决策
              landReserveNum: 6,// 土地储备
              landSupplyNum: 2,// 土地供应
              earlyApproveNum: 8,// 前期审批
              projectBuildNum: 3,// 项目建设
              performanceSupervisionNum: 5,// 绩效监管
              runningAttentionNum: 3,// 运行维护
            }
          } else if (params.projectType === projectTypeMap['产业项目']) {
            object = {
              // 项目阶段分布
              projectAccessNum: 1,// 项目准入
              landReserveNum: 2,// 土地储备
              landSupplyNum: 3,// 土地供应
              earlyApproveNum: 4,// 前期审批
              projectBuildNum: 5,// 项目建设
              performanceSupervisionNum: 6,// 绩效监管
            }
          } else {
            object = {
              // 项目阶段分布
              projectDecisionNum: 0,// 项目决策
              landReserveNum: 0,// 土地储备
              landSupplyNum: 0,// 土地供应
              earlyApproveNum: 0,// 前期审批
              projectBuildNum: 0,// 项目建设
              runningAttentionNum: 0,// 运行维护
            }
          }
          const res = {
            result: {
              // 项目类型分布
              allProjectNum: 49,
              industryProjectNum: 21,
              municipalProjectNum: 5,
              bridgeProjectNum: 16,
              facilityProjectNum: 7,
              ...object,
              // 项目列表
              projectList: [
                {
                  projectId: '1',
                  projectName: '项目名称1',
                  currentStepName: '项目当前环节名称1',
                  nextStepName: '项目下一环节名称1',
                },
                {
                  projectId: '2',
                  projectName: '项目名称2',
                  currentStepName: '项目当前环节名称2',
                  nextStepName: '项目下一环节名称2',
                },
                {
                  projectId: '3',
                  projectName: '项目名称3',
                  currentStepName: '项目当前环节名称3',
                  nextStepName: '项目下一环节名称3',
                },
                {
                  projectId: '4',
                  projectName: '项目名称4',
                  currentStepName: '项目当前环节名称4',
                  nextStepName: '项目下一环节名称4',
                },
                {
                  projectId: '5',
                  projectName: '项目名称5',
                  currentStepName: '项目当前环节名称5',
                  nextStepName: '项目下一环节名称5',
                },
              ],
            }
          }
          resolve(res);
        }, 500);
      });
    },
    async getData() {
      console.log('this.projectType', this.projectType);

      const params = {
        projectType: this.projectType === '全部' ? null : projectTypeMap[this.projectType],
        // periodIds: this.selectedIndex!==null ? this.projectProgressStatisticsList[this.selectedIndex].period_id : [],
        periodIds: this.typeMap[this.selectedPeriod],
        startTime: this.rangeTime[0],
        endTime: this.rangeTime[1],
      };
      this.loading = true;
      const { result } = await request({
        url: '/pm/ruProjectBaseinfo/projectProcessProgress',
        method: 'post',
        data: params,
      });
      // const {result} = await this.getFalseData(params);
      // 项目类型分布
      this.projectTypeList[0].value = result.allProjectNum;
      this.projectTypeList[1].value = result.industryProjectNum;
      this.projectTypeList[2].value = result.municipalProjectNum;
      this.projectTypeList[3].value = result.bridgeProjectNum;
      this.projectTypeList[4].value = result.facilityProjectNum;
      // 项目阶段分布
      // 如果是全部
      if (this.projectType === '全部') {
        this.allList[0].value = result.projectAccessNum;
        this.allList[1].value = result.projectDecisionNum;
        this.allList[2].value = result.landReserveNum;
        this.allList[3].value = result.landSupplyNum;
        this.allList[4].value = result.earlyApproveNum;
        this.allList[5].value = result.projectBuildNum;
        this.allList[6].value = result.performanceSupervisionNum;
        this.allList[7].value = result.runningAttentionNum;
      } else if (this.projectType === '产业项目') {
        this.list1[0].value = result.projectAccessNum;
        this.list1[1].value = result.landReserveNum;
        this.list1[2].value = result.landSupplyNum;
        this.list1[3].value = result.earlyApproveNum;
        this.list1[4].value = result.projectBuildNum;
        this.list1[5].value = result.performanceSupervisionNum;
      } else {
        this.list2[0].value = result.projectDecisionNum;
        this.list2[1].value = result.landReserveNum;
        this.list2[2].value = result.landSupplyNum;
        this.list2[3].value = result.earlyApproveNum;
        this.list2[4].value = result.projectBuildNum;
        this.list2[5].value = result.runningAttentionNum;
      }

      this.data.sum = 0;
      this.data.period['项目准入'].value = result.projectAccessNum || 0;
      this.data.period['项目决策'].value = result.projectDecisionNum || 0;
      this.data.period['土地储备'].value = result.landReserveNum || 0;
      this.data.period['土地供应'].value = result.landSupplyNum || 0;
      this.data.period['前期审批'].value = result.earlyApproveNum || 0;
      this.data.period['项目建设'].value = result.projectBuildNum || 0;
      this.data.period['绩效监管'].value = result.performanceSupervisionNum || 0;
      this.data.period['运行维护'].value = result.runningAttentionNum || 0;

      // 设置百分比
      this.data.period['项目准入'].percent = result.projectAccessPercent || 0;
      this.data.period['项目决策'].percent = result.projectDecisionPercent || 0;
      this.data.period['土地储备'].percent = result.landReservePercent || 0;
      this.data.period['土地供应'].percent = result.landSupplyPercent || 0;
      this.data.period['前期审批'].percent = result.earlyApprovePercent || 0;
      this.data.period['项目建设'].percent = result.projectBuildPercent || 0;
      this.data.period['绩效监管'].percent = result.performanceSupervisionPercent || 0;
      this.data.period['运行维护'].percent = result.runningAttentionPercent || 0;

      for (const key in this.data.period) {
        this.data.sum += this.data.period[key].value;
      }


      this.list = result.projectList;
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
      let list = []
      if (this.selectedIndex !== null) {
        for (let i = 0; i < this.projectProgressStatisticsList[this.selectedIndex].period_id.length; i++) {
          list.push({
            periodId: this.projectProgressStatisticsList[this.selectedIndex].period_id[i],
            periodName: this.projectProgressStatisticsList[this.selectedIndex].period_name,
          });
        }
      }
      if (this.selectedPeriod) {
        list = this.typeMap[this.selectedPeriod].map(item => {
          return {
            periodId: item,
            periodName: this.selectedPeriod,
          }
        });
      }
      const params = {
        // 项目创建时间
        createTimeBeginTime: this?.rangeTime ? this.rangeTime[0] : null,
        createTimeEndTime: this?.rangeTime ? this.rangeTime[1] : null,
        projectTypeCodeList: this.projectType === '全部' ? null : [projectTypeMap[this.projectType]],
        // 项目阶段分布
        periodStepReps: list.length ? list : null,
      }
      console.log('params', params);
      this.$router.push({
        name: 'ProjectList',
        state: {
          params,
        },
      });
    },

  },
};
</script>

<style lang="scss">
.project-progress-statistics {
  .el-table td.el-table__cell {
    height: 50px;
  }
}
</style>
