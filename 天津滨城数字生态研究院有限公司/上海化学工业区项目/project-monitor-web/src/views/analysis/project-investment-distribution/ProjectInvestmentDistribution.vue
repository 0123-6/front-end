<template>
  <!--项目投资分布-->
  <div v-if="!onlyChart" class="project-investment-distribution px-5 flex flex-col bg-white text-sm" v-loading="loading"
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
      <div class="w-[60%] flex flex-col border-r border-dashed border-r-black-line pr-6">
        <!--标题-->
        <title-comp title="项目投资分布" :type="2" />
        <!--图表-->
        <bar-chart-hpj style="width: 100%;height: 309px;" ref="chart" :chart-data="chartData" @change="change" />
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
          <!--投资总额(万元) totalInvestment-->
          <el-table-column label="投资总额(万元)" prop="projectAmount" width="130" show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row?.projectAmount ? toThousands(scope.row?.projectAmount) : '-' }}
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
        <title-comp title="项目投资分布" :type="2" />
        <!--图表-->
        <bar-chart-hpj style="width: 100%;height: 290px;" class="picture" ref="chart" :chart-data="chartData"
          @change="change" />
      </div>
      <!--下-->
      <div class="flex flex-col border-t border-dashed border-black-line pt-3.5">
        <!--标题-->
        <div class="flex justify-between items-center">
          <!--左-->
          <selected-condition label="项目投资分布" :have-value="rangeAmount && rangeAmount[0] !== null"
            @clear-condition="clearCondition">
            <template #content>
              <div class="flex items-center select-none">
                <span class="text-main ddin-n">{{ toThousands(rangeAmount[0]) }}-{{ toThousands(rangeAmount[1]) }}</span>
                <span class="text-main">万元</span>
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
          <!--投资总额(万元) totalInvestment-->
          <el-table-column label="投资总额(万元)" prop="projectAmount" width="130" show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row?.projectAmount ? toThousands(scope.row?.projectAmount) : '-' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <!--仅图表-->
  <div v-else>
    <bar-chart-hpj style="width: 100%;height: 290px;" class="picture3" ref="chart" :chart-data="chartData"
      @change="change" />
  </div>
</template>

<script>
import TitleComp from "@/views/index/components/TitleComp";
import BarChartHpj from "@/views/index/components/BarChartHpj";
import { toThousands } from "@/utils/index";
import mixinList from "@/views/index/mixin/mixinList";
import { projectTypeMap } from "@/views/index/static";
import request from "@/utils/request";
import MenuListWithLine from "@/views/analysis/components/MenuListWithLine.vue";
import CloseSvg from "@/views/policy/components/icon/CloseSvg.vue";
import SelectedCondition from "@/views/analysis/components/SelectedCondition.vue";

export default {
  name: 'ProjectInvestmentDistribution',
  mixins: [
    mixinList,
  ],
  components: {
    SelectedCondition,
    CloseSvg,
    MenuListWithLine,
    BarChartHpj,
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
      // 金额范围
      rangeAmount: [null, null],
      list: [],
      // 项目投资分布
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
      this.rangeAmount = [null, null];
      this.$refs.chart.init();
      this.getData();
    },
    projectType(val) {
      this.rangeAmount = [null, null];
      this.$refs.chart.init();
      this.getData();
    },
  },
  created() {
    this.getData();
  },
  methods: {
    clearCondition() {
      this.rangeAmount = [null, null];
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
              projectAmount: 10000,
            },
            {
              projectName: '市政项目1',
              projectTypeCode: 'municipal_project',
              projectAmount: 20000,
            },
            {
              projectName: '市政项目2',
              projectTypeCode: 'municipal_project',
              projectAmount: 30000,
            },
            {
              projectName: '路桥项目1',
              projectTypeCode: 'bridge_project',
              projectAmount: 40000,
            },
            {
              projectName: '路桥项目2',
              projectTypeCode: 'bridge_project',
              projectAmount: 50000,
            },
            {
              projectName: '路桥项目3',
              projectTypeCode: 'bridge_project',
              projectAmount: 60000,
            },
            {
              projectName: '公共设施项目1',
              projectTypeCode: 'facility_project',
              projectAmount: 70000,
            },
            {
              projectName: '公共设施项目2',
              projectTypeCode: 'facility_project',
              projectAmount: 80000,
            },
            {
              projectName: '公共设施项目3',
              projectTypeCode: 'facility_project',
              projectAmount: 90000,
            },
            {
              projectName: '公共设施项目4',
              projectTypeCode: 'facility_project',
              projectAmount: 100000,
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
                  x: '0-30,000',
                  y: 0,
                  other: {
                    minInvestAmount: 0,
                    maxInvestAmount: 30000,
                    totalAmount: 181000,
                  },
                },
                {
                  x: '30,000-60,000',
                  y: 0,
                  other: {
                    minInvestAmount: 30000,
                    maxInvestAmount: 60000,
                    totalAmount: 181000,
                  },
                },
                {
                  x: '60,000-90,000',
                  y: 0,
                  other: {
                    minInvestAmount: 60000,
                    maxInvestAmount: 90000,
                    totalAmount: 181000,
                  },
                },
                {
                  x: '90,000-120,000',
                  y: 0,
                  other: {
                    minInvestAmount: 90000,
                    maxInvestAmount: 120000,
                    totalAmount: 181000,
                  },
                },
                {
                  x: '120,000-150,000',
                  y: 0,
                  other: {
                    minInvestAmount: 120000,
                    maxInvestAmount: 150000,
                    totalAmount: 181000,
                  },
                },
                {
                  x: '150,000以上',
                  y: 0,
                  other: {
                    minInvestAmount: 150000,
                    maxInvestAmount: null,
                    totalAmount: 181000,
                  },
                },
              ],
              // 项目列表
              projectList: allList,
            },
          };
          // 根据projectType更新chartData
          const chartData = allList.filter(item => {
            if (params?.projectType) {
              return item.projectTypeCode === params.projectType;
            }
            return true;
          });
          // 根据chartData更新res.result.chartData
          for (let i = 0; i < chartData.length; i++) {
            const findIndex = res.result.chartData.findIndex(item => item.other.minInvestAmount <= chartData[i].projectAmount && item.other.maxInvestAmount > chartData[i].projectAmount);
            if (findIndex !== -1) {
              res.result.chartData[findIndex].y++;
            }
          }


          if (params?.projectType) {
            res.result.projectList = res.result.projectList.filter(item => item.projectTypeCode === params.projectType);
          }
          // 筛选金额，最小值和最大值
          if (params?.minInvestAmount) {
            res.result.projectList = res.result.projectList.filter(item => item.projectAmount >= params.minInvestAmount);
          }
          if (params?.maxInvestAmount) {
            res.result.projectList = res.result.projectList.filter(item => item.projectAmount < params.maxInvestAmount);
          }
          // 截取前5条
          res.result.projectList = res.result.projectList.slice(0, 5);
          resolve(res);
        }, 500);
      });
    },
    change(params) {
      this.rangeAmount = params.rangeAmount ? params.rangeAmount : [null, null];
      this.getData(true);
    },
    async getData(onlyUpdateList = false) {
      const params = {
        projectType: this.projectType === '全部' ? null : projectTypeMap[this.projectType],
        minInvestAmount: this?.rangeAmount ? this.rangeAmount[0] : null,
        maxInvestAmount: this?.rangeAmount ? this.rangeAmount[1] : null,
        startTime: this.rangeTime[0],
        endTime: this.rangeTime[1],
      };
      this.loading = true;
      const { result } = await request({
        url: '/pm/ruProjectBaseinfo/projectInvestDistribute',
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
            createTimeBeginTime: this?.rangeTime ? this.rangeTime[0] : null,
            createTimeEndTime: this?.rangeTime ? this.rangeTime[1] : null,
            projectTypeCodeList: this.projectType === '全部' ? null : [projectTypeMap[this.projectType]],
            minInvestAmount: this?.rangeAmount ? this.rangeAmount[0] : null,
            maxInvestAmount: this?.rangeAmount ? this.rangeAmount[1] : null,
          },
        },
      });
    },
  },
};
</script>

<style lang="scss">
.project-investment-distribution {
  .el-table td.el-table__cell {
    height: 50px;
  }
}
</style>

