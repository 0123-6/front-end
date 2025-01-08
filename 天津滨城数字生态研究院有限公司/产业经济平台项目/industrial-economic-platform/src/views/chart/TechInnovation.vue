<template>
  <div class="scroll-item">
    <div class="line-title scroll-anchor">
      <h3><svg-icon icon-class="technology"></svg-icon>{{ title }}</h3>
    </div>
    <div>
      <el-row type="flex" class="shadow-row">
        <el-col v-loading="loading" :span="12" class="dashed-right-border">
          <BaseRingChart ref="chart1" :chartData="patentProfileData" :height="'500px'"></BaseRingChart>
        </el-col>
        <el-col v-loading="loading" :span="12">
          <MultipleLineChart ref="chart2" :chartData="addPatentData" symbol="circle" :height="'500px'" :isSmooth="false"></MultipleLineChart>
        </el-col>
      </el-row>
      <el-row class="mt16" :gutter="16" type="flex">
        <el-col :span="15">
          <el-row :gutter="0" type="flex" class="shadow-row">
            <el-col v-loading="loading" :span="mode === 'structure' ? 11 : 10" class="dashed-right-border">
              <DoubleRingChart ref="chart3" :chartData="softwareProfileData"></DoubleRingChart>
            </el-col>
            <el-col v-loading="loading" :span="mode === 'structure' ? 13 : 14">
              <MultipleLineChart
                ref="chart4"
                :chartData="addSoftwareData"
                symbol="circle"
                :isSmooth="false"
                :colorList="['#356DF6', '#4BD9B7']"
                :options="{ grid: { left: 20, right: 20 } }"></MultipleLineChart>
            </el-col>
          </el-row>
        </el-col>
        <el-col v-loading="loading" :span="9">
          <BaseBarWithLineChart
            ref="chart5"
            class="shadow-row"
            :chartData="tradeMarkData"
            :options="{ grid: { left: 30, right: 30 } }"></BaseBarWithLineChart>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { analysisApis } from '@/api/structural-analysis';
import BaseRingChart from '@/components/BaseRingChart';
import MultipleLineChart from '@/components/MultipleLineChart';
import DoubleRingChart from '@/components/DoubleRingChart';
import BaseBarWithLineChart from '@/components/BaseBarWithLineChart';
export default {
  name: 'TechInnovation',
  components: {
    BaseRingChart,
    MultipleLineChart,
    DoubleRingChart,
    BaseBarWithLineChart
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
    },
    mode: {
      type: String,
      default: 'chain'
    }
  },
  data() {
    return {
      loading: false,
      chartAmount: 5,
      patentProfileData: {},
      addPatentData: {},
      softwareProfileData: {},
      addSoftwareData: {},
      tradeMarkData: {}
    };
  },
  watch: {
    params() {
      this.clearData();
      this.getData();
    }
  },
  methods: {
    getData() {
      this.loading = true;
      this.$emit('loading', 1);
      analysisApis
        .getTechInnovation(this.params)
        .then((res) => {
          const result = res.data;
          this.patentProfileData = result.patentLocation;
          this.addPatentData = result.newlyPatent;
          this.addPatentData.unit = '件';
          this.softwareProfileData = {};
          this.softwareProfileData.title = result.copyrightNum.title;
          this.softwareProfileData.totalNum = result.copyrightNum.inNum + result.copyrightNum.outNum;
          this.softwareProfileData.name = ['作品著作权', '软件著作权'];
          this.softwareProfileData.datas = [result.copyrightNum.inNum, result.copyrightNum.outNum];
          this.addSoftwareData = result.newlyCopyright;
          this.addSoftwareData.unit = '件';

          const { newlyTrademark } = result;
          if (newlyTrademark.ydata.length > 0) {
            newlyTrademark.ydata[0] = newlyTrademark.ydata[0].map((n) => Number(n.toFixed(2)));
          }
          this.tradeMarkData = {
            ...newlyTrademark,
            unit: ['件', '%']
          };
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
      this.patentProfileData = {};
      this.addPatentData = {};
      this.softwareProfileData = {};
      this.addSoftwareData = {};
      this.tradeMarkData = {};
    }
  }
};
</script>
