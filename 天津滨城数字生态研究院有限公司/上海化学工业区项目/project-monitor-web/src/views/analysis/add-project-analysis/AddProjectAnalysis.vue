<template>
  <!--项目增长分布-->
  <div v-if="!onlyChart" class="add-project-analysis px-5 flex flex-col bg-white text-sm" v-loading="loading" :style="{
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
      <div class="w-[60%] flex flex-col border-r border-dashed border-r-black-line pr-6">
        <!--标题和切换栏-->
        <div class="w-full flex justify-between items-center">
          <!--标题-->
          <title-comp title="项目增长分布" :type="2" />
          <!--切换栏-->
          <div class="w-[132px] h-[25px] rounded-lg border border-[#E8EEF3] bg-white flex">
            <el-tooltip v-for="(item, index) in timeDimensionList" :key="index" placement="bottom"
              popper-class="tooltip-76 tooltip-x-14 tooltip-y-6">
              <template #content>
                <div v-if="item === '月'" class="w-full flex flex-col gap-1 text-white">
                  <div class="flex items-center">
                    <span class="text-sm leading-5">1月：</span>
                    <span class="ddin-n font-bold text-base leading-5">M1</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-5">2月：</span>
                    <span class="ddin-n font-bold text-base leading-5">M2</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-[17px]">...</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-5">12月：</span>
                    <span class="ddin-n font-bold text-base leading-5">M12</span>
                  </div>
                </div>
                <div v-if="item === '季'" class="w-full flex flex-col gap-1 text-white">
                  <div class="flex items-center">
                    <span class="text-sm leading-5">一季度：</span>
                    <span class="ddin-n font-bold text-base leading-5">Q1</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-5">二季度：</span>
                    <span class="ddin-n font-bold text-base leading-5">Q2</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-5">三季度：</span>
                    <span class="ddin-n font-bold text-base leading-5">Q3</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-5">四季度：</span>
                    <span class="ddin-n font-bold text-base leading-5">Q4</span>
                  </div>
                </div>
                <div v-if="item === '年'" class="w-full flex flex-col gap-1 text-white">
                  <div class="flex items-center">
                    <span class="text-sm leading-5">2021年：</span>
                    <span class="ddin-n font-bold text-base leading-5">2021Y</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-5">2022年：</span>
                    <span class="ddin-n font-bold text-base leading-5">2022Y</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-5">2023年：</span>
                    <span class="ddin-n font-bold text-base leading-5">2023Y</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-[15px]">...</span>
                  </div>
                </div>
              </template>
              <div class="flex-1 h-full cursor-pointer flex justify-center items-center rounded-lg" :class="[
                item === timeDimension ? 'bg-main' : 'bg-white',
              ]" @click="timeDimension = item">
                <span class="text-xs" :class="[
                  item === timeDimension ? 'text-white' : 'text-black-three',
                ]">{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
        <!--图表-->
        <bar-and-line-chart style="width: 100%;height: 309px;" ref="chart" :chart-data="chartData" @change="change" />
      </div>
      <!--右侧-->
      <div class="w-[40%] h-full pl-5 flex flex-col">
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
          <!--工程性质-->
          <el-table-column label="工程性质" prop="projectTypeCode" min-width="110" show-overflow-tooltip>
            <template #default="scope">
              <span>{{ projectTypeMap[scope.row?.projectTypeCode] }}</span>
            </template>
          </el-table-column>
          <!--项目创建时间-->
          <el-table-column label="项目创建时间" prop="createTime" min-width="150" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </div>
    <!--垂直方式-->
    <div v-if="showType === 'vertical'" class="mt-[17px] flex flex-col">
      <!--上-->
      <div class="flex flex-col">
        <!--标题和切换栏-->
        <div class="w-full flex justify-between items-center">
          <!--标题-->
          <title-comp title="项目增长分布" :type="2" />
          <!--切换栏-->
          <div class="w-[132px] h-[25px] rounded-lg border border-[#E8EEF3] bg-white flex">
            <el-tooltip v-for="(item, index) in timeDimensionList" :key="index" placement="bottom"
              popper-class="tooltip-76 tooltip-x-14 tooltip-y-6">
              <template #content>
                <div v-if="item === '月'" class="w-full flex flex-col gap-1 text-white">
                  <div class="flex items-center">
                    <span class="text-sm leading-5">1月：</span>
                    <span class="ddin-n font-bold text-base leading-5">M1</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-5">2月：</span>
                    <span class="ddin-n font-bold text-base leading-5">M2</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-[17px]">...</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-5">12月：</span>
                    <span class="ddin-n font-bold text-base leading-5">M12</span>
                  </div>
                </div>
                <div v-if="item === '季'" class="w-full flex flex-col gap-1 text-white">
                  <div class="flex items-center">
                    <span class="text-sm leading-5">一季度：</span>
                    <span class="ddin-n font-bold text-base leading-5">Q1</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-5">二季度：</span>
                    <span class="ddin-n font-bold text-base leading-5">Q2</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-5">三季度：</span>
                    <span class="ddin-n font-bold text-base leading-5">Q3</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-5">四季度：</span>
                    <span class="ddin-n font-bold text-base leading-5">Q4</span>
                  </div>
                </div>
                <div v-if="item === '年'" class="w-full flex flex-col gap-1 text-white">
                  <div class="flex items-center">
                    <span class="text-sm leading-5">2021年：</span>
                    <span class="ddin-n font-bold text-base leading-5">2021Y</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-5">2022年：</span>
                    <span class="ddin-n font-bold text-base leading-5">2022Y</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-5">2023年：</span>
                    <span class="ddin-n font-bold text-base leading-5">2023Y</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm leading-[15px]">...</span>
                  </div>
                </div>
              </template>
              <div class="flex-1 h-full cursor-pointer flex justify-center items-center rounded-lg" :class="[
                item === timeDimension ? 'bg-main' : 'bg-white',
              ]" @click="timeDimension = item">
                <span class="text-xs" :class="[
                  item === timeDimension ? 'text-white' : 'text-black-three',
                ]">{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
        <!--图表-->
        <bar-and-line-chart style="width: 100%;height: 290px;" class="picture" ref="chart" :chart-data="chartData"
          @change="change" />
      </div>
      <!--下-->
      <div class="flex flex-col border-t border-dashed border-black-line pt-3.5">
        <!--标题-->
        <div class="flex justify-between items-center">
          <!--左-->
          <selected-condition label="项目增长分布" :have-value="timeRange && timeRange[0] !== null"
            @clear-condition="clearCondition">
            <template #content>
              <div class="flex items-center select-none">
                <span class="text-main ddin-n">{{ timeRangeLabel }}</span>
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
          <!--工程性质-->
          <el-table-column label="工程性质" prop="projectTypeCode" min-width="110" show-overflow-tooltip>
            <template #default="scope">
              <span>{{ projectTypeMap[scope.row?.projectTypeCode] }}</span>
            </template>
          </el-table-column>
          <!--项目创建时间-->
          <el-table-column label="项目创建时间" prop="createTime" min-width="150" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <!--仅图表-->
  <div v-else>
    <bar-and-line-chart style="width: 100%;height: 290px;" class="picture4" ref="chart" :chart-data="chartData"
      @change="change" />
  </div>
</template>

<script>
import TitleComp from "@/views/index/components/TitleComp";
import { toThousands } from "@/utils/index";
import BarAndLineChart from "@/views/analysis/add-project-analysis/components/BarAndLineChart";
import mixinList from "@/views/index/mixin/mixinList";
import { projectTypeMap } from "@/views/index/static";
import request from "@/utils/request";
import MenuListWithLine from "@/views/analysis/components/MenuListWithLine.vue";
import SelectedCondition from "@/views/analysis/components/SelectedCondition.vue";

export default {
  name: 'AddProjectAnalysis',
  mixins: [
    mixinList,
  ],
  components: {
    SelectedCondition,
    MenuListWithLine,
    BarAndLineChart,
    TitleComp,
  },
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
    onlyChart: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      projectTypeMap,
      loading: false,
      timeDimension: '月',
      timeDimensionList: ['月', '季', '年'],
      // 选中的时间范围
      timeRange: [null, null],
      timeRangeLabel: '',
      list: [],
      // 项目增长分布
      projectType: '全部',
      projectTypeList: [
        { name: '全部', value: 0 },
        { name: '产业项目', value: 0 },
        { name: '市政项目', value: 0 },
        { name: '路桥项目', value: 0 },
        { name: '公共设施项目', value: 0 },
      ],
      chartData: [],
    };
  },
  watch: {
    rangeTime(val) {
      this.projectType = '全部';
      this.timeDimension = '月';
      this.timeRange = [null, null];
      this.timeRangeLabel = '';
      this.$refs.chart.init();
      this.getData();
    },
    projectType(val) {
      this.timeDimension = '月';
      this.timeRange = [null, null];
      this.timeRangeLabel = '';
      this.$refs.chart.init();
      this.getData();
    },
    timeDimension(val) {
      this.timeRange = [null, null];
      this.timeRangeLabel = '';
      this.$refs.chart.init();
      this.getData();
    },
  },
  created() {
    this.getData();
  },
  methods: {
    clearCondition() {
      this.timeRange = [null, null];
      this.timeRangeLabel = '';
      this.$refs.chart.init();
      this.getData();
    },
    toThousands,
    async getFalseData(params) {
      console.log('params', params);
      return new Promise((resolve) => {
        setTimeout(() => {
          const allList = [
            {
              projectName: '产业项目1',
              projectTypeCode: 'industry_project',
              createTime: '2021-01-01',
            },
            {
              projectName: '市政项目1',
              projectTypeCode: 'municipal_project',
              createTime: '2021-02-01',
            },
            {
              projectName: '市政项目2',
              projectTypeCode: 'municipal_project',
              createTime: '2021-03-01',
            },
            {
              projectName: '路桥项目1',
              projectTypeCode: 'bridge_project',
              createTime: '2021-04-01',
            },
            {
              projectName: '路桥项目2',
              projectTypeCode: 'bridge_project',
              createTime: '2021-05-01',
            },
            {
              projectName: '路桥项目3',
              projectTypeCode: 'bridge_project',
              createTime: '2021-06-01',
            },
            {
              projectName: '公共设施项目1',
              projectTypeCode: 'facility_project',
              createTime: '2021-07-01',
            },
            {
              projectName: '公共设施项目2',
              projectTypeCode: 'facility_project',
              createTime: '2021-08-01',
            },
            {
              projectName: '公共设施项目3',
              projectTypeCode: 'facility_project',
              createTime: '2021-09-01',
            },
            {
              projectName: '公共设施项目4',
              projectTypeCode: 'facility_project',
              createTime: '2021-10-01',
            },
          ];
          const res = {
            result: {
              // 项目类型分布
              allProjectNum: 10,
              industryProjectNum: 1,
              municipalProjectNum: 2,
              bridgeProjectNum: 3,
              facilityProjectNum: 4,
              // 左侧柱状图信息
              chartData: [
                {
                  x: '2022 Q1',
                  y: {
                    newItemNumber: 5,
                    // 同比增长率
                    yearOnYearGrowthRate: 0.5,
                    // 环比增长率
                    quarterOnQuarterGrowthRate: 0.3,
                  },
                  other: {
                    beginDate: '2022-01-01',
                    finishDate: '2022-03-31',
                  },
                },
                {
                  x: '2022 Q2',
                  y: {
                    newItemNumber: 6,
                    // 同比增长率
                    yearOnYearGrowthRate: 0.4,
                    // 环比增长率
                    quarterOnQuarterGrowthRate: 0.3,
                  },
                  other: {
                    beginDate: '2022-04-01',
                    finishDate: '2022-06-30',
                  },
                },
              ],
              // 项目列表
              projectList: allList,
            },
          };
          // 截取前5条
          res.result.projectList = res.result.projectList.slice(0, 5);
          resolve(res);
        }, 500);
      });
    },
    change(params) {
      this.timeRange = params.timeRange ? params.timeRange : [null, null];
      this.timeRangeLabel = params.label ? params.label : '';
      this.getData(true);
    },
    async getData(onlyUpdateList = false) {
      const params = {
        startTime: this.rangeTime[0],
        endTime: this.rangeTime[1],
        projectType: this.projectType === '全部' ? null : projectTypeMap[this.projectType],
        beginDate: this?.timeRange ? this.timeRange[0] : null,
        finishDate: this?.timeRange ? this.timeRange[1] : null,
        // 时间维度
        timeDimension: this.timeDimension === '月' ? 'M' : this.timeDimension === '季' ? 'Q' : 'Y',
      };
      this.loading = true;
      const { result } = await request({
        url: '/pm/ruProjectBaseinfo/projectAddSituation',
        method: 'post',
        data: params,
      });
      result.chartData = result.chartArray;
      // const {result} = await this.getFalseData(params);
      console.log('result', result);
      if (!onlyUpdateList) {
        // 项目类型分布
        this.projectTypeList[0].value = result.allProjectNum;
        this.projectTypeList[1].value = result.industryProjectNum;
        this.projectTypeList[2].value = result.municipalProjectNum;
        this.projectTypeList[3].value = result.bridgeProjectNum;
        this.projectTypeList[4].value = result.facilityProjectNum;
        // 左侧柱状图信息
        this.chartData = JSON.parse(JSON.stringify(result.chartData));
      }
      // 项目列表
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
      this.$router.push({
        name: 'ProjectList',
        state: {
          params: {
            // 项目创建时间
            createTimeBeginTime: this?.timeRange ? this.timeRange[0] : this?.rangeTime ? this.rangeTime[0] : null,
            createTimeEndTime: this?.timeRange ? this.timeRange[1] : this?.rangeTime ? this.rangeTime[1] : null,
            projectTypeCodeList: this.projectType === '全部' ? null : [projectTypeMap[this.projectType]],
          },
        },
      });
    },
  },
};
</script>

<style lang="scss">
.add-project-analysis {
  .el-table td.el-table__cell {
    height: 50px;
  }
}
</style>

