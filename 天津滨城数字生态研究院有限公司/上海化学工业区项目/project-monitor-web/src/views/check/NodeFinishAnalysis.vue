<template>
  <div class="NodeFinishAnalysis">
    <ee-title title="各环节完成情况" />
    <div class="ee-card ee-card--shadow mt12 pdl20 pdr20 pdb20">
      <el-radio-group class="ee-radio-group" v-model="projectCategory" @change="changeProjectType">
        <el-radio-button label="0">全部项目({{ countData.all || 0 }})</el-radio-button>
        <el-radio-button v-for="n in project_type" :label="n.itemCode" :key="n.itemName">
          {{ n.itemName }}({{ countData[n.itemCode] || 0 }})
        </el-radio-button>
      </el-radio-group>
      <ee-title class="mt16" title="各环节处理情况统计图" level="2" />
      <div class="d-flex ai-center jc-around mt16">
        <div class="chart-wrap">
          <RingChart ref="chart0" :data="chartData" :options="chartOptions" height="150px" />
        </div>
        <div class="chart-wrap">
          <RingChart ref="chart1" :data="chartDataInner" :options="chartOptions" height="150px" />
        </div>
        <div class="chart-wrap">
          <RingChart ref="chart2" :data="chartDataOuter" :options="chartOptions" height="150px" />
        </div>
      </div>
      <el-divider class="mt16" direction="horizontal" border-style="dashed" />
      <el-row class="mt16">
        <el-col class="pdr20" :span="12" style="border-right: 1px dashed #DBE1E9;">
          <ee-title title="各环节延期次数排名统计图" level="2" />
          <div>
            <el-table class="mt16 is-borderless" :data="tableData">
              <el-table-column label="排名" width="60" align="center" show-overflow-tooltip>
                <template v-slot="sc"><span class="ddin-n">{{ sc.$index + 1 }}</span></template>
              </el-table-column>
              <el-table-column prop="node" label="环节" min-width="80" show-overflow-tooltip />
              <el-table-column label="延期次数 (次)" min-width="100" show-overflow-tooltip>
                <template v-slot="sc">
                  <div class="d-flex ai-center jc-end">
                    <div class="ddin-n mr12">{{ sc.row.delayTimes }}</div>
                    <el-progress class="flex-1 is-rank" :percentage="sc.row.percent" :stroke-width="9"
                      :show-text="false" />
                  </div>
                </template>
              </el-table-column>
              <template #empty>
                <el-empty class="ee-empty-data is-sm" description="暂无数据" style="margin-top: 80px;">
                  <template #image>
                    <svg-icon icon-class="empty-data" />
                  </template>
                </el-empty>
              </template>
            </el-table>
          </div>
        </el-col>
        <el-col class="pdl20" :span="12">
          <ee-title title="各环节延期总时长排名统计图" level="2" />
          <div>
            <el-table class="mt16 is-borderless" :data="tableData" style="width: 100%;">
              <el-table-column label="排名" width="60" align="center" show-overflow-tooltip>
                <template v-slot="sc"><span class="ddin-n">{{ sc.$index + 1 }}</span></template>
              </el-table-column>
              <el-table-column prop="node" label="环节" min-width="80" show-overflow-tooltip />
              <el-table-column label="延期时长 (天)" min-width="100" show-overflow-tooltip>
                <template v-slot="sc">
                  <div class="d-flex ai-center jc-end">
                    <div class="ddin-n mr12">{{ sc.row.delayTimes }}</div>
                    <el-progress class="flex-1 is-rank" :percentage="sc.row.percent" :stroke-width="9"
                      :show-text="false" />
                  </div>
                </template>
              </el-table-column>
              <template #empty>
                <el-empty class="ee-empty-data is-sm" description="暂无数据" style="margin-top: 80px;">
                  <template #image>
                    <svg-icon icon-class="empty-data" />
                  </template>
                </el-empty>
              </template>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import RingChart from '@/components/RingChart'
import { stepBaseFlow_stepFlow } from '@/api/pm/stepBaseFlow.js'
import useDictStore from '@/store/modules/dict'
import * as api from '@/api/pm/ruProjectBaseinfo'
import { performance_getStepDelayedRank } from '@/api/pm/performance.js'
export default {
  name: 'NodeFinishAnalysis',
  components: {
    RingChart,
  },
  props: {
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      ...useDictStore().getDicts(['project_type']),
      countData: {},
      projectCategory: '0',
      chartData: {
        totalNum: 131,
        totalName: '环节总数',
        unit: '个',
        seriesData: [
          { name: '按时完成', value: 77 },
          { name: '延期完成', value: 54 },
        ]
      },
      chartDataInner: {
        totalNum: 52,
        totalName: '内部环节总数',
        unit: '个',
        seriesData: [
          { name: '按时完成', value: 35 },
          { name: '延期完成', value: 17 },
        ]
      },
      chartDataOuter: {
        totalNum: 79,
        totalName: '外部环节总数',
        unit: '个',
        seriesData: [
          { name: '按时完成', value: 42 },
          { name: '延期完成', value: 37 },
        ]
      },
      chartOptions: {
        color: ['#02ADEC', '#FAB752', '#F28C53'],
        legend: {
          show: false
        },
        showLegendPercent: false,
        boldValue: true,
        unit: '个',
        series: {
          center: [70, '50%'],
          minAngle: 3,
          radius: [44, 60],
        },
      },
      tableData: []
    }
  },
  watch: {
    params() {
      this.getData()
    }
  },
  created() {
    // this.getData()
    this.getDataList()
    this.getNodeFlowList()
  },
  methods: {
    changeProjectType() {
      this.getData()
    },
    getData() {
      performance_getStepDelayedRank({
        ...this.params,
        projectType: this.projectCategory
      }).then(({ result }) => {

      }).catch(e => {
      })
    },
    getDataList() {
      const params = {
        current: 1,
        size: 0,
      }
      this.loading = true
      api.ruProjectBaseinfo_queryProjectManagePage(params).then(({ result }) => {
        const { allProjectNum, bridgeProjectNum, facilityProjectNum, industryProjectNum, municipalProjectNum } = result
        this.countData = {
          all: allProjectNum,
          industry_project: industryProjectNum,
          municipal_project: municipalProjectNum,
          bridge_project: bridgeProjectNum,
          facility_project: facilityProjectNum,
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getNodeFlowList() {
      stepBaseFlow_stepFlow({ "conditionReqList": [{ "conditionCode": "land_supply_type", "conditionItemCode": "land_sale" }], "periodId": 10003 }).then(({ result }) => {
        this.tableData = result.splice(0, 10).map((n, i) => ({
          node: n.stepName,
          delayTimes: 20 - i * 2,
          percent: 50 - i * 2,
        }))
      })
    }
  }
};
</script>

<style lang="scss">
.NodeFinishAnalysis {
  .chart-wrap {
    width: 300px;
  }
}
</style>


