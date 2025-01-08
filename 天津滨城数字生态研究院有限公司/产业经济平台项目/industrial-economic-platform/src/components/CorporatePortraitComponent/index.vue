<script>
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import BaseInfo from '@/components/CorporatePortraitComponent/components/BaseInfo.vue';
import ManagementAbility from '@/components/CorporatePortraitComponent/components/ManagementAbility.vue';
import InnovationAbility from '@/components/CorporatePortraitComponent/components/InnovationAbility.vue';
import FinancingCapacity from '@/components/CorporatePortraitComponent/components/FinancingCapacity.vue';
import QualificationReward from '@/components/CorporatePortraitComponent/components/QualificationReward.vue';
import SocialContribution from '@/components/CorporatePortraitComponent/components/SocialContribution.vue';
import { baseApis } from '@/api/corporate-portrait';
import BaseRadarChart from '@/components/BaseRadarChart/index.vue';

const dicts = JSON.parse(localStorage.getItem('iep_platform_all_dict'));
export default defineComponent({
  name: 'CorporatePortraitComponent',
  components: {
    BaseRadarChart,
    SocialContribution,
    QualificationReward,
    FinancingCapacity,
    InnovationAbility,
    ManagementAbility,
    BaseInfo
  },
  data() {
    return {
      historyLen: window.history.length,
      companyId: '',
      activeTab: 'basicInfo',
      companyBase: {},
      evaluationData: {
        name: '',
        data: []
      },
      companyTabs: [],
      companyStatusMap: {},
      keyCompanyMap: {},
      totalScore: 0,
      company_status: dicts.company_status
    };
  },
  computed: {
    ...mapGetters([]),
    handleEmail() {
      if (this.companyBase.email) {
        const arr = this.companyBase.email.split(',');
        return arr[0];
      }
      return '-';
    }
  },
  created() {
    this.companyId = this.$route.params.id;
    this.handleColor(dicts);
  },
  mounted() {
    this.getCompanyBase();
    this.getCompanyTabs();
    this.getEvaluation();
    if (sessionStorage.getItem('activeTab')) {
      this.activeTab = sessionStorage.getItem('activeTab');
      sessionStorage.removeItem('activeTab');
    }
  },
  methods: {
    handleClick(tab, event) {
      this.activeTab = tab.name;
    },
    handleColor(data) {
      this.companyStatusMap = new Map(data?.company_status.map((item) => [item.itemCode, item]));
      this.keyCompanyMap = new Map(data?.key_company.map((item) => [item.itemCode, item]));
    },
    getCompanyBase() {
      baseApis.getBaseInfoData({ companyId: this.companyId }).then((res) => {
        this.companyBase = {
          ...res.data
          // email: 'zhouys@sungrowpower.com,zhouys@subu',
          // phoneNum: '0551-25663323',
          // website: 'www.sungrowpower.com'
        };
      });
    },
    getEvaluation() {
      baseApis.getEvaluationData({ companyId: this.companyId }).then((res) => {
        const businessCapacity = {
          name: '经营能力',
          max: 100,
          value: res.data.businessCapacity
        };
        // const businessRisk = {
        //   name: '企业风险',
        //   max: 100,
        //   value: res.data.businessRisk
        // };
        const expandScore = {
          name: '扩张意愿',
          max: 100,
          value: res.data.expandScore
        };
        const innovationScore = {
          name: '科技创新',
          max: 100,
          value: res.data.innovationScore
        };
        const investValue = {
          name: '投资价值',
          max: 100,
          value: res.data.investValue
        };
        const socialImpact = {
          name: '社会影响',
          max: 100,
          value: res.data.socialImpact
        };
        this.totalScore = res.data.totalScore;
        this.evaluationData.data = [businessCapacity, expandScore, innovationScore, investValue, socialImpact];
      });
    },
    getCompanyTabs() {
      baseApis.getCompanyTabsData({ companyId: this.companyId }).then((res) => {
        this.companyTabs = res.data;
      });
    }
  }
});
</script>

<template>
  <div class="corporate-portrait">
    <div class="corporate-portrait__top">
      <div class="back-bar">
        <div class="ee-view-title d-flex ai-center">
          <template v-if="historyLen > 1">
            <el-button class="ee-button--back" type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">返回</el-button>
            <span class="ee-split"></span>
          </template>
          <span class="title">企业画像</span>
        </div>
      </div>
      <div class="corporate-info">
        <div class="company-baseinfo">
          <div class="top d-flex ai-center">
            <div class="d-flex ai-center flex-1">
              <span class="name ell">{{ companyBase.companyName || companyBase.legalPersonName || '-' }}</span>
              <div v-if="companyBase.regStatus" class="ee-tag--dot is-dark" :class="'is-' + companyBase.regStatus">
                {{ company_status.find((n) => n.itemCode == companyBase.regStatus).itemName }}
              </div>
            </div>
            <div class="assess-mark">
              <img src="@/assets/icons/tag.svg" />
              <div class="text-center ell">评估结果：{{ totalScore.toFixed(2) }}</div>
            </div>
          </div>
          <div class="bottom d-flex">
            <img v-if="companyBase.imageUrl" :src="companyBase.imageUrl" class="avatar" />
            <div v-else class="avatar-text flex-center ai-center">{{ (companyBase.companyName || companyBase.legalPersonName || '').charAt(0) }}</div>
            <div class="flex-1">
              <div
                v-if="companyBase?.types?.length > 0 || companyBase.board || companyBase.sename"
                class="ee-company-type d-flex ai-center flex-wrap">
                <span
                  class="ee-company-type-tag"
                  v-for="childItem of companyBase.types"
                  :key="childItem"
                  :style="{
                    color: keyCompanyMap.get(childItem)?.color,
                    background: keyCompanyMap.get(childItem)?.backgroundColor
                  }">
                  {{ keyCompanyMap.get(childItem)?.itemName || childItem }}</span
                >
                <span v-if="companyBase.board || companyBase.sename" class="ee-company-type-tag" style="color: #fff; background: #97a0b6">
                  {{ companyBase.board || '' }}{{ companyBase.sename || '' }}
                </span>
              </div>
              <div class="ee-company-intro">
                <div class="d-flex">
                  <div class="item flex-1">
                    法定代表人： <span>{{ companyBase.legalPersonName || '-' }}</span>
                  </div>
                  <div class="item flex-1">
                    统一社会信用代码：
                    <span v-if="companyBase.creditNo" class="f-d-din">{{ companyBase.creditNo }}</span>
                    <span v-else>-</span>
                  </div>
                </div>
                <div class="d-flex">
                  <div class="item flex-1">
                    公司电话：
                    <span v-if="companyBase.phoneNum" class="f-d-din">{{ companyBase.phoneNum }}</span>
                    <span v-else>-</span>
                  </div>
                  <div class="item flex-1 d-flex ai-center">
                    公司网址：
                    <el-link
                      v-if="companyBase.website"
                      class="ee-link f-d-din"
                      type="primary"
                      :href="companyBase.website?.indexOf('//') > -1 ? companyBase.website : '//' + companyBase.website"
                      :underline="false"
                      target="_blank"
                      >{{ companyBase.website }}</el-link
                    >
                    <span v-else>-</span>
                  </div>
                </div>
                <div class="d-flex">
                  <div class="item">
                    公司电子邮箱：
                    <el-popover v-if="companyBase.email" placement="top" width="200" trigger="hover" :disabled="companyBase.email.indexOf(',') < 0">
                      <span slot="reference" class="f-d-din">{{ handleEmail }}</span>
                      <div v-for="n in companyBase.email.split(',')" :key="n">{{ n }}</div>
                    </el-popover>
                    <span v-else>-</span>
                  </div>
                </div>
                <div class="d-flex">
                  <div class="item">
                    地址：<span
                      >{{ companyBase.provinceName }}
                      {{ companyBase.cityName ? `/${companyBase.cityName}` : '' }}
                      {{ companyBase.countyName ? `/${companyBase.countyName}` : '' }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="ee-company-layout d-flex ai-start">
                <span>产业布局：</span>
                <div
                  class="d-flex ai-center flex-wrap"
                  :class="{ 'flex-1': companyBase.industrialLayoutList && companyBase.industrialLayoutList.length > 0 }">
                  <span class="ee-company-layout-tag" v-for="childItem of companyBase.industrialLayoutList" :key="childItem">{{ childItem }}</span>
                  <!-- <span class="ee-company-layout-tag" v-for="childItem of 10" :key="childItem">布局{{ childItem }}</span> -->
                </div>
                <span v-if="!companyBase.industrialLayoutList || companyBase.industrialLayoutList.length === 0">-</span>
              </div>
            </div>
            <BaseRadarChart ref="chart1" :chart-data="evaluationData" height="220px" width="360px"></BaseRadarChart>
          </div>
        </div>

        <div class="corporate-info-bar">
          <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
            <el-tab-pane v-for="item of companyTabs" :key="item.itemCode" :label="item.itemName" :name="item.itemCode"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="company-container">
      <keep-alive>
        <BaseInfo v-if="activeTab === 'basicInfo'" :company-id="companyId"></BaseInfo>
        <ManagementAbility v-if="activeTab === 'business'" :company-id="companyId"></ManagementAbility>
        <InnovationAbility v-if="activeTab === 'creation'" :company-id="companyId"></InnovationAbility>
        <FinancingCapacity v-if="activeTab === 'financing'" :company-id="companyId"></FinancingCapacity>
        <QualificationReward v-if="activeTab === 'cert'" :company-id="companyId"></QualificationReward>
        <SocialContribution v-if="activeTab === 'social'" :company-id="companyId"></SocialContribution>
      </keep-alive>
    </div>
  </div>
</template>

<style scoped lang="less">
.corporate-portrait {
  width: 100%;
  height: 100%;
  &__top {
    background: #fff;
    box-shadow: 0px 0px 16px 0px rgba(20, 38, 82, 0.07);
  }
  .back-bar {
    padding: 0 0 0 24px;
  }
  .company-baseinfo {
    .radar-chart-container {
      margin: 0 50px 0 20px;
    }
    .f-d-din {
      font-size: 16px;
    }
    .top {
      padding: 30px 0 26px;
      position: relative;
      .name {
        color: #1a262c;
        font-size: 20px;
        font-weight: 500;
        // cursor: pointer;
      }
    }
    .ee-tag--dot {
      margin-left: 22px;
    }
    .avatar,
    .avatar-text {
      margin-right: 18px;
      width: 88px;
      height: 88px;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      background: #fff;
    }
    .avatar {
      object-fit: contain;
    }
    .avatar-text {
      box-sizing: border-box;
      border: 1px solid #e9e9e9;
      background: #356df6;
      font-size: 36px;
      color: #fff;
    }
    .ee-company-intro {
      > div {
        margin-bottom: 12px;
      }
    }
  }
  .assess-mark {
    position: relative;
    height: 41px !important;
    font-size: 0;
    div {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 138px;
      color: #fff;
      font-family: PingFang SC;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
    }
  }
  .corporate-info {
    padding: 0 14px 0 24px;
    ::v-deep .corporate-info-bar {
      margin-top: 6px;
      .el-tabs--card > .el-tabs__header {
        margin-bottom: 1px !important;
        border: 0;
      }
      .el-tabs--card > .el-tabs__header .el-tabs__nav {
        border: 0;
      }
      .el-tabs__item {
        color: #4b5666;
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        border-radius: 2px 2px 0 0;
        border: 1px solid #f0f0f0;
        background: #fafafa;
        border-bottom: 0;
        margin-right: 2px;
      }

      .el-tabs__item:last-child {
        margin-right: 0;
      }
      .el-tabs__item.is-active,
      .el-tabs__item:hover {
        color: #356df6;
        font-weight: 500;
        background: #fff;
        border-bottom: 1px solid #fff;
      }
    }
  }
  .company-container {
    margin: 8px auto 24px auto;
    height: 100%;
    background: #fff;
    box-shadow: 0px 0px 16px 0px rgba(20, 38, 82, 0.07);
  }
}
.StrCharAt {
  display: flex;
  align-items: center;
  > span:first-child {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 88px;
    height: 88px;
    color: #fff;
    font-family: PingFang SC;
    font-size: 36px;
    font-weight: 400;
    border-radius: 4px;
    border: 1px solid #e9e9e9;
    background: #356df6;
  }
}
.label-value {
  & > span {
    font-size: 12px;
    color: #666666;
    &:first-child {
      font-weight: bold;
      color: #333333;
    }
  }
}
</style>
