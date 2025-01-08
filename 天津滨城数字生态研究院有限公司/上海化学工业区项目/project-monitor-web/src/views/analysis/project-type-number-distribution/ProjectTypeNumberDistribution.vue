<template>
  <!--工程性质分布-->
  <div class="project-type-number-distribution px-5 flex flex-col bg-white text-sm" v-loading="loading" :style="{
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
    <!--		<menu-list-with-line v-if="source === 'analysis'"-->
    <!--		                     v-model:project-type="projectType"-->
    <!--		                     :list="projectTypeList"/>-->
    <!--内容-->
    <div v-if="showType === 'horizontal'" class="mt-4 h-[331px] flex">
      <!--左侧-->
      <div class="w-[32.5%] flex flex-col border-r border-dashed border-r-black-line pr-6">
        <!--标题-->
        <title-comp title="工程性质分布" :type="2" />
        <!--图表rose-type="radius" :radius="['0%', '100%']"-->
        <project-status-distribution-pie style="width: 100%;height: 309px;" ref="chart" :legend-type="1"
          :chart-data="chart.list" :legend-click="false" :border-width="2" title="工程性质分布" :show-inner-label="true"
          :color-list="chart.colorList1" />
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
          <!--工程性质-->
          <el-table-column label="工程性质" prop="projectTypeCode" min-width="110" show-overflow-tooltip>
            <template #default="scope">
              <span>{{ projectTypeMap[scope.row?.projectTypeCode] }}</span>
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
        <title-comp title="工程性质分布" :type="2" />
        <!--图表rose-type="radius" :radius="['0%', '100%']"-->
        <project-status-distribution-pie style="width: 100%;height: 339px;" ref="chart" :legend-type="2"
          :chart-data="chart.list" :legend-click="true" :border-width="2" title="工程性质分布" :show-inner-label="true"
          :color-list="chart.colorList2" @change="change" />
      </div>
      <!--下-->
      <div class="flex flex-col border-t border-dashed border-black-line pt-3.5">
        <!--标题-->
        <div class="flex justify-between items-center">
          <!--左-->
          <selected-condition label="工程性质分布" :have-value="projectType !== '全部'" @clear-condition="clearCondition">
            <template #content>
              <div class="flex items-center select-none">
                <span class="text-main">{{ projectType }}</span>
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
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import TitleComp from "@/views/index/components/TitleComp";
import ProjectStatusDistributionPie from "@/views/index/components/ProjectStatusDistributionPie";
import mixinList from "@/views/index/mixin/mixinList";
import { projectTypeMap } from "@/views/index/static";
import request from "@/utils/request";
import MenuListWithLine from "@/views/analysis/components/MenuListWithLine.vue";
import SelectedCondition from "@/views/analysis/components/SelectedCondition.vue";

export default {
  name: 'ProjectTypeNumberDistribution',
  mixins: [
    mixinList,
  ],
  components: {
    SelectedCondition,
    MenuListWithLine,
    TitleComp,
    ProjectStatusDistributionPie,
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
  },
  data() {
    return {
      projectTypeMap,
      loading: false,
      list: [],
      // 全部项目列表
      listAll: [],
      // 产业项目列表
      list1: [],
      // 市政项目列表
      list2: [],
      // 路桥项目列表
      list3: [],
      // 公共设施项目列表
      list4: [],
      // 工程性质分布
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
          { name: '产业项目', value: 0 },
          { name: '市政项目', value: 0 },
          { name: '路桥项目', value: 0 },
          { name: '公共设施项目', value: 0 },
        ],
        colorList1: ['#BECDF9', '#436FF6', '#02ADEC', '#74E6F6'],
        colorList2: [
          {
            text: '#BECDF9',
            light: '#F8FAFE',
          },
          {
            text: '#436FF6',
            light: '#ECF1FE',
          },
          {
            text: '#02ADEC',
            light: '#E6F7FD',
          },
          {
            text: '#74E6F6',
            light: '#F1FDFE',
          },
        ],
      },
    };
  },
  watch: {
    rangeTime(val) {
      this.projectType = '全部';
      this.$refs.chart.init();
      this.getData();
    },
  },
  created() {
    this.getData();
  },
  methods: {
    clearCondition() {
      this.projectType = '全部';
      this.$refs.chart.init();
      this.getData(true);
    },
    change(item) {
      this.projectType = item ? item : '全部';
      this.getData(true);
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
              // 全部列表
              allProjectList: [
                {
                  projectId: '1',
                  projectName: '项目名称1',
                  projectTypeCode: 'industry_project',
                },
                {
                  projectId: '2',
                  projectName: '项目名称2',
                  projectTypeCode: 'municipal_project',
                },
                {
                  projectId: '3',
                  projectName: '项目名称3',
                  projectTypeCode: 'bridge_project',
                },
                {
                  projectId: '4',
                  projectName: '项目名称4',
                  projectTypeCode: 'facility_project',
                },
                {
                  projectId: '5',
                  projectName: '项目名称5',
                  projectTypeCode: 'industry_project',
                }
              ],
              // 产业项目列表
              industryProjectList: [
                {
                  projectId: '1',
                  projectName: '项目名称1',
                  projectTypeCode: 'industry_project',
                },
                {
                  projectId: '5',
                  projectName: '项目名称5',
                  projectTypeCode: 'industry_project',
                }
              ],
              // 市政项目列表
              municipalProjectList: [
                {
                  projectId: '2',
                  projectName: '项目名称2',
                  projectTypeCode: 'municipal_project',
                }
              ],
              // 路桥项目列表
              bridgeProjectList: [
                {
                  projectId: '3',
                  projectName: '项目名称3',
                  projectTypeCode: 'bridge_project',
                }
              ],
              // 公共设施项目列表
              facilityProjectList: [
                {
                  projectId: '4',
                  projectName: '项目名称4',
                  projectTypeCode: 'facility_project',
                }
              ],
            },
          }
          resolve(res);
        }, 500);
      })
    },
    async getData(justGetList = false) {
      if (justGetList) {
        if (this.projectType === '全部') {
          this.list = this.listAll;
        } else if (this.projectType === '产业项目') {
          this.list = this.list1;
        } else if (this.projectType === '市政项目') {
          this.list = this.list2;
        } else if (this.projectType === '路桥项目') {
          this.list = this.list3;
        } else if (this.projectType === '公共设施项目') {
          this.list = this.list4;
        }
        return;
      }
      const params = {
        startTime: this.rangeTime[0],
        endTime: this.rangeTime[1],
      };
      this.loading = true;
      const { result } = await request({
        url: '/pm/ruProjectBaseinfo/projectType',
        method: 'post',
        data: params,
      });
      // const {result} = await this.getFalseData();
      // 项目类型分布
      this.projectTypeList[0].value = result.allProjectNum;
      this.projectTypeList[1].value = result.industryProjectNum;
      this.projectTypeList[2].value = result.municipalProjectNum;
      this.projectTypeList[3].value = result.bridgeProjectNum;
      this.projectTypeList[4].value = result.facilityProjectNum;
      // chart的list数据
      this.chart.list[0].value = result.industryProjectNum;
      this.chart.list[1].value = result.municipalProjectNum;
      this.chart.list[2].value = result.bridgeProjectNum;
      this.chart.list[3].value = result.facilityProjectNum;
      // 全部项目列表
      this.listAll = result.allProjectList;
      // 产业项目列表
      this.list1 = result.industryProjectList;
      // 市政项目列表
      this.list2 = result.municipalProjectList;
      // 路桥项目列表
      this.list3 = result.bridgeProjectList;
      // 公共设施项目列表
      this.list4 = result.facilityProjectList;
      // 项目列表
      this.list = result.allProjectList;
      this.loading = false;
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
          },
        },
      });
    },
  },
};
</script>

<style lang="scss">
.project-type-number-distribution {
  .el-table td.el-table__cell {
    height: 50px;
  }
}
</style>

