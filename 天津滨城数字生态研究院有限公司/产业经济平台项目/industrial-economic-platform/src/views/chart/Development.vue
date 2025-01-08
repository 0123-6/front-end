<template>
  <div class="Development scroll-item">
    <div class="line-title scroll-anchor">
      <h2><svg-icon icon-class="development"></svg-icon>{{ title }}</h2>
    </div>
    <el-row v-loading="loading" type="flex" class="mt16 shadow-row" style="background: #fff">
      <el-col :span="evaluationData.datas.length > 0 ? 11 : 24">
        <BaseRadarWithBarChart ref="chart1" :chartData="evaluationData"></BaseRadarWithBarChart>
      </el-col>
      <el-col v-if="evaluationData.datas.length > 0" class="flex-center" :span="13" style="height: 550px">
        <div>
          <el-col class="development-ability-card" v-for="(item, index) of evaluationData.datas" :key="index">
            <div class="progress-box">
              <span>{{ item.name }}</span>
              <el-progress
                class="d-flex ai-center flex-1"
                :percentage="Number(item.value)"
                :stroke-width="8"
                define-back-color="#96a0b81a"
                color="#96A0B8"
                :format="formatProgress"></el-progress>
            </div>
            <div style="padding: 0 10px">
              <div class="flex-box flex-wrap" v-for="(innerItem, innerIndex) of item.child" :key="index + innerIndex">
                <div>{{ innerItem.name }}</div>
                <div class="num">{{ innerItem.value }}</div>
                分
              </div>
            </div>
          </el-col>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/*eslint-disable*/
import { analysisApis } from '@/api/structural-analysis';
import BaseRadarWithBarChart from '@/components/BaseRadarWithBarChart';
export default {
  name: 'Development',
  components: {
    BaseRadarWithBarChart
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
      chartAmount: 1,
      evaluationData: {
        title: '综合评估',
        datas: []
      }
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
        .getEvaluation(this.params)
        .then((res) => {
          const { industrialActivity, industrialAggregation, industrialEfficiency, industrialInnovation, industrialProsperity } = res.data;
          if (industrialActivity.children) {
            industrialActivity.name = '产业活跃度';
            industrialActivity.max = 100;
            industrialActivity.value = industrialActivity.industrialActivity;
            const growthRate = {
              name: '增长速率',
              value: industrialActivity.children.growthRate
            };
            const marketActivity = {
              name: '市场活跃度',
              value: industrialActivity.children.marketActivity
            };
            industrialActivity.child = [];
            industrialActivity.child.push(growthRate, marketActivity);
          }
          if (industrialAggregation.children) {
            industrialAggregation.name = '产业集聚度';
            industrialAggregation.max = 100;
            industrialAggregation.value = industrialAggregation.industrialAggregation;
            const hfdIndex = {
              name: '赫芬达指数',
              value: industrialAggregation.children.hfdIndex
            };
            const lq = {
              name: '区位商',
              value: industrialAggregation.children.lq
            };
            industrialAggregation.child = [];
            industrialAggregation.child.push(hfdIndex, lq);
          }
          if (industrialEfficiency.children) {
            industrialEfficiency.name = '产业效益性';
            industrialEfficiency.max = 100;
            industrialEfficiency.value = industrialEfficiency.industrialEfficiency;
            const capitalScale = {
              name: '资本规模',
              value: industrialEfficiency.children.capitalScale
            };
            const socialScore = {
              name: '社会效益',
              value: industrialEfficiency.children.socialScore
            };
            const economyScore = {
              name: '经济效益评分',
              value: industrialEfficiency.children.economyScore
            };
            industrialEfficiency.child = [];
            industrialEfficiency.child.push(capitalScale, economyScore, socialScore);
          }
          if (industrialInnovation.children) {
            industrialInnovation.name = '产业创新力';
            industrialInnovation.max = 100;
            industrialInnovation.value = industrialInnovation.industrialInnovation;
            const innovationEnv = {
              name: '创新环境',
              value: industrialInnovation.children.innovationEnv
            };
            const innovationInput = {
              name: '创新投入',
              value: industrialInnovation.children.innovationInput
            };
            const innovationOutput = {
              name: '创新产出',
              value: industrialInnovation.children.innovationOutput
            };
            industrialInnovation.child = [];
            industrialInnovation.child.push(innovationEnv, innovationInput, innovationOutput);
          }
          if (industrialProsperity.children) {
            industrialProsperity.name = '产业景气度';
            industrialProsperity.max = 100;
            industrialProsperity.value = industrialProsperity.industrialProsperity;
            const mainMarket = {
              name: '市场主体',
              value: industrialProsperity.children.mainMarket
            };
            const marketScale = {
              name: '市场规模',
              value: industrialProsperity.children.marketScale
            };
            industrialProsperity.child = [];
            industrialProsperity.child.push(mainMarket, marketScale);
          }
          this.evaluationData.datas = [
            industrialActivity,
            industrialAggregation,
            industrialEfficiency,
            industrialInnovation,
            industrialProsperity
          ].filter((n) => n.child);

          this.$nextTick(() => {
            this.$refs.chart1 && this.$refs.chart1.chart.resize();
          });
          this.loading = false;
          this.$emit('loading', -1);
        })
        .catch(() => {
          this.loading = false;
          this.$emit('loading', -1);
        });
    },
    formatProgress(value) {
      return ` ${value} 分`;
    },
    clearData() {
      this.evaluationData = {
        title: '综合评估',
        datas: []
      };
    }
  }
};
</script>

<style lang="less">
.Development {
  .development-ability-card {
    width: calc(50% - 26px);
    margin: 10px;
    border-radius: 0px 0px 2px 2px;
    border: 1px solid #e9e9e9;
    background: #fff;
    height: 150px;
    padding: 0 !important;
    .progress-box {
      display: flex;
      align-items: center;
      padding: 18px 20px;
      gap: 3px;
      background: rgba(150, 160, 184, 0.1);
      color: #1a262c;
      text-align: center;
      font-size: 14px;
      .el-progress {
        margin-left: 10px;
      }
      .el-progress-bar {
        margin-right: 0;
        padding-right: 0;
        width: auto;
        flex: 1;
      }
    }
  }
  .flex-box {
    display: inline-flex;
    width: 50%;
    box-sizing: border-box;
    padding: 4px 10px;
    align-items: center;
    justify-content: space-between;
    color: #888b8f;
    text-align: right;
    font-size: 12px;
    .num {
      color: #4b5666;
      text-align: right;
      font-family: D-DIN-Bold;
      font-size: 18px;
      font-weight: 700;
    }
  }
}
</style>