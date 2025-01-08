<template>
  <div class="ProjectTimeDist">
    <ee-title title="各阶段耗时分布" />
    <el-row class="mt12" :gutter="16">
      <el-col :span="12">
        <div class="ee-card ee-card--shadow flex-1 pdt16">
          <ee-title class="ml16" title="产业项目" level="2" />
          <div class="chart-wrap">
            <RingChart ref="chart0" :data="chartData1" :options="chartOptions1" height="254px" />
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="ee-card ee-card--shadow flex-1 pdt16">
          <ee-title class="ml16" title="其它项目" level="2" />
          <div class="chart-wrap">
            <RingChart ref="chart1" :data="chartData2" :options="chartOptions2" height="254px" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RingChart from '@/components/RingChart'
import { performance_getComUsedDays } from '@/api/pm/performance.js'
const options = {
  legend: {
    show: false
  },
  unit: '天',
  series: {
    roseType: 'radius',
    center: [100, '50%'],
    minAngle: 3,
    radius: [0, 90],
    label: {
      show: false
    },
    emphasis: {
      scaleSize: 2,
      itemStyle: {
        borderWidth: 0,
        opacity: 0.9
      }
    },
  },
}
export default {
  name: 'ProjectTimeDist',
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
      form: {},
      chartData1: {
        totalNum: 0,
        seriesData: []
      },
      chartData2: {
        totalNum: 0,
        seriesData: []
      },
      chartOptions1: {
        color: ['#436FF6', '#02ADEC', '#74CBF6', '#BCE6F9', '#9BA2E2', '#BECDF9'],
        ...options
      },
      chartOptions2: {
        color: ['#8FE7E1', '#6D8EE4', '#02ADEC', '#74CBF6', '#9BA2E2', '#92E3A4'],
        ...options
      },
    }
  },
  watch: {
    params() {
      this.getData()
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      performance_getComUsedDays(this.params).then(({ result }) => {
        const { industryProjectUsedDays = [], otherProjectUsedDays = [] } = result || {}
        this.chartData1 = this.getChartData(industryProjectUsedDays)
        this.chartData2 = this.getChartData(otherProjectUsedDays)
      }).catch(e => {
      })
    },
    getChartData(data) {
      let sum = 0
      let seriesData = data.map(n => {
        sum += n.useDays
        return {
          value: n.useDays,
          name: n.periodName
        }
      })
      return {
        totalNum: sum,
        seriesData
      }
    }
  }
};
</script>

<style lang="scss">
.ProjectTimeDist {
  .chart-wrap {
    margin: 0 auto;
    width: 500px;
  }
}
</style>

