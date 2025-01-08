<template>
  <div class="EnterpriseAnalysis scroll-item">
    <div class="line-title scroll-anchor">
      <h3><svg-icon icon-class="company"></svg-icon>{{ title }}</h3>
    </div>
    <div>
      <el-row type="flex" class="shadow-row">
        <el-col v-loading="loading" :span="8" class="dashed-right-border">
          <BaseBarChart ref="chart1" name="在营企业数量" :chartData="companyData"></BaseBarChart>
        </el-col>
        <el-col v-loading="loading" :span="8" class="dashed-right-border">
          <BaseLineChart ref="chart2" name="新增企业数量" :chartData="addCompanyData" symbol="circle"></BaseLineChart>
        </el-col>
        <el-col v-loading="loading" :span="8">
          <BaseLineChart
            ref="chart3"
            name="吊销企业数量"
            :chartData="reduceCompanyData"
            symbol="circle"
            color="#44CCD4"
            :background-color="['#44ccd433', '#44ccd400']"></BaseLineChart>
        </el-col>
      </el-row>
      <el-row class="mt16 shadow-row" v-if="params.regionLevel > 0" type="flex">
        <el-col v-loading="loading" :span="6" class="dashed-right-border d-flex">
          <div class="text-chart text-center">
            <div class="chart-title text-left">{{ moveCompanyData.title }}</div>
            <div class="text-chart-content">
              <div class="chart-item">
                <div>
                  <svg-icon icon-class="moveOut"></svg-icon>
                  迁出企业
                </div>
                <span>
                  <span class="number">{{ moveCompanyData.outNum }}</span>
                  家
                </span>
              </div>
              <div class="chart-item">
                <div>
                  <svg-icon icon-class="moveIn"></svg-icon>
                  迁入企业
                </div>
                <span>
                  <span class="number">{{ moveCompanyData.inNum }}</span>
                  家
                </span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col v-loading="loading" :span="9" class="dashed-right-border">
          <BaseBarChart ref="chart4" :chartData="moveInCompanyData" color="#6bcad2" />
        </el-col>
        <el-col v-loading="loading" :span="9">
          <BaseBarChart ref="chart5" :chartData="moveOutCompanyData" color="#4170ee" />
        </el-col>
      </el-row>
      <el-row class="mt16" type="flex" :gutter="16">
        <el-col v-loading="loading" :span="12">
          <BaseRingChart
            ref="chart6_"
            class="shadow-row companyNumDistribute"
            class-name="companyNumDistribute"
            :chartData="companyWaterfallData"
            height="441px"
            :options="{ domTitle: true }"
            defaultHighlight />
        </el-col>
        <el-col v-loading="loading" :span="12">
          <BaseRingChart
            ref="chart7_"
            class="shadow-row companyTypeDistribute"
            class-name="companyTypeDistribute"
            :chartData="companyTypeData"
            height="441px"
            :options="{ domTitle: true }"
            defaultHighlight />
        </el-col>
      </el-row>
      <el-row class="mt16 shadow-row">
        <el-col v-loading="loading" :span="24">
          <BaseBarChart ref="chart8" :chartData="companyAgeData"></BaseBarChart>
        </el-col>
      </el-row>
      <el-row class="mt16 shadow-row" type="flex">
        <el-col v-loading="loading" :span="8" class="dashed-right-border">
          <BaseLineChart ref="chart9" :chartData="companyThreeData" symbol="circle"></BaseLineChart>
        </el-col>
        <el-col v-loading="loading" :span="8" class="dashed-right-border">
          <BaseLineChart ref="chart10" :chartData="companyFiveData" symbol="circle"></BaseLineChart>
        </el-col>
        <el-col v-loading="loading" :span="8">
          <BaseLineChart
            ref="chart11"
            :chartData="companyDeadData"
            symbol="circle"
            color="#CC4F47"
            :background-color="['#cc4f4733', '#cc4f4700']"></BaseLineChart>
        </el-col>
      </el-row>
      <el-row class="mt16" :gutter="16" type="flex">
        <el-col v-loading="loading" :span="10">
          <BaseFunnelChart ref="chart12" class="shadow-row" :chartData="importantCompanyData"></BaseFunnelChart>
        </el-col>
        <el-col v-loading="loading" :span="14">
          <BaseBarChart ref="chart13" class="shadow-row" :chartData="composeCompanyData"></BaseBarChart>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { analysisApis } from '@/api/structural-analysis';
import BaseBarChart from '@/components/BaseBarChart';
import BaseLineChart from '@/components/BaseLineChart';
import BaseFunnelChart from '@/components/BaseFunnelChart';
import BaseRingChart from '@/components/BaseRingChart';
export default {
  name: 'EnterpriseAnalysis',
  components: {
    BaseBarChart,
    BaseLineChart,
    BaseFunnelChart,
    BaseRingChart
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      loading: false,
      chartAmount: 13,
      adaptWidth: 1600,
      companyData: {},
      addCompanyData: {},
      reduceCompanyData: {},
      moveCompanyData: {},
      moveInCompanyData: {},
      moveOutCompanyData: {},
      companyWaterfallData: {},
      companyTypeData: {},
      companyAgeData: {},
      companyThreeData: {},
      companyFiveData: {},
      companyDeadData: {},
      importantCompanyData: {},
      composeCompanyData: {}
    };
  },
  watch: {
    params() {
      this.clearData();
      this.getData();
    }
  },
  mounted() {
    this.customResize();
  },
  methods: {
    getData() {
      this.loading = true;
      this.$emit('loading', 1);
      analysisApis
        .getCompanyAnalyse(this.params)
        .then((res) => {
          const result = res.data;
          const { companyType } = result;
          this.companyData = result.companyTotalNum;
          this.companyData.unit = '家';
          this.addCompanyData = result.newlyCompanyNum;
          this.addCompanyData.unit = '家';
          this.reduceCompanyData = result.revokeCompanyNum;
          this.reduceCompanyData.unit = '家';

          if (this.params.regionLevel > 0) {
            this.moveCompanyData = result.companyInOutStatistics;
            this.moveInCompanyData = {
              unit: '家',
              ...result.companyInNum
            };
            this.moveOutCompanyData = {
              unit: '家',
              ...result.companyOutNum
            };
          }

          const repCapitalAnalyseData = result.repCapitalAnalyse.xdata
            .map((n, i) => ({ name: n, value: result.repCapitalAnalyse.ydata[i] }))
            .sort((a, b) => b.value - a.value);
          this.companyWaterfallData = {
            ...result.repCapitalAnalyse,
            xdata: repCapitalAnalyseData.map((n) => n.name),
            ydata: repCapitalAnalyseData.map((n) => n.value)
          };

          companyType.datas.sort((a, b) => b.value - a.value);
          this.companyTypeData = {
            ...companyType,
            xdata: companyType.datas.map((n) => n.name),
            ydata: companyType.datas.map((n) => n.value)
          };

          this.companyAgeData = result.companyAge;
          this.companyAgeData.unit = '家';

          const { threeSurvivalRate } = result;
          threeSurvivalRate.ydata = threeSurvivalRate.ydata.map((n) => Number(n.toFixed(2)));
          this.companyThreeData = {
            ...threeSurvivalRate,
            unit: '%'
          };

          const { fiveSurvivalRate } = result;
          fiveSurvivalRate.ydata = fiveSurvivalRate.ydata.map((n) => Number(n.toFixed(2)));
          this.companyFiveData = {
            ...fiveSurvivalRate,
            unit: '%'
          };

          const { deathRate } = result;
          deathRate.ydata = deathRate.ydata.map((n) => Number(n.toFixed(2)));
          this.companyDeadData = {
            ...deathRate,
            unit: '%'
          };

          this.importantCompanyData = {
            ...result.keyEnterpriseType,
            datas: result.keyEnterpriseType.datas.sort((a, b) => a.value - b.value)
          };
          this.composeCompanyData = result.listedCompany;
          this.composeCompanyData.unit = '家';
          this.loading = false;
          this.$emit('loading', -1);
        })
        .catch((err) => {
          this.loading = false;
          this.$emit('loading', -1);
          console.log(err);
        });
    },
    clearData() {
      this.companyData = {};
      this.addCompanyData = {};
      this.reduceCompanyData = {};
      this.moveCompanyData = {};
      this.moveInCompanyData = {};
      this.moveOutCompanyData = {};
      this.companyWaterfallData = {};
      this.companyTypeData = {};
      this.companyAgeData = {};
      this.companyThreeData = {};
      this.companyFiveData = {};
      this.companyDeadData = {};
      this.importantCompanyData = {};
      this.composeCompanyData = {};
    },
    customResize() {
      console.log('EnterpriseAnalysis customResize');
      document.querySelector('.companyNumDistribute .ee-chart__inner').style.transform = `scale(${Math.min(
        document.querySelector('.companyNumDistribute').clientWidth / 600,
        1
      )})`;
      document.querySelector('.companyTypeDistribute .ee-chart__inner').style.transform = `scale(${Math.min(
        document.querySelector('.companyTypeDistribute').clientWidth / 580,
        1
      )})`;
    }
  }
};
</script>

<style lang="less">
.EnterpriseAnalysis {
  .companyNumDistribute {
    .ee-chart__inner {
      margin: 0 auto;
      width: 600px !important;
      transform-origin: left center;
    }
  }
  .companyTypeDistribute {
    .ee-chart__inner {
      margin: 0 auto;
      width: 580px !important;
      transform-origin: left center;
    }
  }
}
</style>