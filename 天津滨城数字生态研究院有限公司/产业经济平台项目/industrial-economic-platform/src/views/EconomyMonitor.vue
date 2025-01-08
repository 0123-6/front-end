<!--
 * @Date: 2023-09-06 17:54:33
 * @LastEditors: zywu 1061096367@qq.com
 * @LastEditTime: 2023-09-12 10:15:35
 * @FilePath: /industrial-economic-platform/src/views/economy-monitor/index.vue
-->
<template>
  <div class="economy-monitor">
    <div class="scroll-content">
      <div class="wrap-top">
        <div v-loading="loading" element-loading-custom-class="ee-loading--none" class="d-flex ai-center">
          <el-breadcrumb class="ee-breadcrumb" separator="/" style="margin-right: 52px">
            <el-breadcrumb-item>宏观经济</el-breadcrumb-item>
            <el-breadcrumb-item class="is-active">经济运行监测</el-breadcrumb-item>
          </el-breadcrumb>
          <div>当前统计区域：</div>
          <ee-cascader
            ref="EeCascader"
            v-model="curRegion"
            placeholder="全部"
            :options="regionTree"
            :multiple="false"
            :clearable="false"
            :disableValues="disableRegions"
            autoResize
            :maxLevel="2"
            @change="confirmRegion" />
        </div>
        <div class="d-flex ai-center space-between count-list">
          <div class="count-box" v-for="n in countList" :key="n.name">
            <div class="d-flex ai-center jc-between">
              <div class="flex-1 ell title">{{ n.name }}</div>
              <div v-if="n.date" class="period">{{ n.date }}</div>
            </div>
            <div class="ell money-row">
              <span class="money">{{ n.value }}</span>
              <span class="unit">{{ n.unit }}</span>
            </div>
            <div class="d-flex ai-center space-between trend-row" :class="{ 'no-trend': n.grow === '--' }">
              <div class="d-flex ai-center">
                <span class="ml10">同比</span>
                <span class="percent" :class="{ up: n.grow > 0 }">{{ n.grow }}{{ n.grow === '--' ? '' : '%' }}</span>
                <svg-icon v-if="n.grow != '--'" :icon-class="`arrow-${n.grow > 0 ? 'up' : 'down'}`" />
              </div>
              <svg-icon v-if="n.grow != '--'" class-name="icon-trend" :icon-class="`trend-${n.grow > 0 ? 'up' : 'down'}`" />
              <div v-else class="icon-trend"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="wrap-body">
        <div class="tabs-row">
          <div v-loading="loading" element-loading-custom-class="ee-loading--none" class="d-flex ai-center">
            <div>对比区域：</div>
            <ee-cascader
              ref="EeCascader2"
              v-model="compareRegions"
              placeholder="选择对比区域"
              mode="button"
              :options="regionTree"
              clearable
              :disableValues="disableCompareRegions"
              :maxLevel="2"
              :limit="5" />
            <el-button class="ee-button" type="primary" size="small" @click="confirmCompareRegion" style="margin-left: 10px"> 确定 </el-button>
          </div>
          <el-tabs class="ee-tabs" v-model="tabIndex" @tab-click="handleScroll">
            <el-tab-pane v-if="showTabs['0']" label="生产总值" name="0"></el-tab-pane>
            <el-tab-pane v-if="showTabs['1']" label="规上工业增加值" name="1"></el-tab-pane>
            <el-tab-pane v-if="showTabs['2']" label="固定资产投资" name="2"></el-tab-pane>
            <el-tab-pane v-if="showTabs['3']" label="社会消费品零售总额" name="3"></el-tab-pane>
            <el-tab-pane v-if="showTabs['4']" label="进出口总额" name="4"></el-tab-pane>
            <el-tab-pane v-if="showTabs['5']" label="居民收入消费" name="5"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="wrap-body__inner">
          <div v-if="showTabs['0']" class="scroll-item">
            <div class="main-title d-flex ai-center scroll-anchor">
              <h3><svg-icon icon-class="money-cny"></svg-icon>生产总值（GDP）</h3>
              <span class="suffix">更新时间：{{ gdpDate }}</span>
            </div>
            <el-row v-loading="loading" v-for="(n, i) in outputChartData" :key="i" type="flex" class="shadow-row">
              <el-col :span="12" class="dashed-right-border">
                <bar-group-chart :ref="`chart${i * 2}`" class="total-gdp" :chartData="n.barData" />
              </el-col>
              <el-col :span="12">
                <multiple-line-chart
                  :ref="`chart${i * 2 + 1}`"
                  :chartData="n.lineData"
                  :colorList="colorList"
                  :options="lineOptions"
                  :isSmooth="false" />
              </el-col>
            </el-row>
          </div>
          <div v-if="showTabs['1']" class="scroll-item" style="margin-top: 13px">
            <div class="main-title d-flex ai-center scroll-anchor">
              <h3><svg-icon icon-class="line-chart"></svg-icon>规上工业增加值</h3>
              <span class="suffix">更新时间：{{ industryDate }}</span>
            </div>
            <el-row v-loading="loading" type="flex" class="shadow-row">
              <el-col :span="12" class="dashed-right-border">
                <bar-group-chart ref="chart8" :chartData="industryVal" />
              </el-col>
              <el-col :span="12">
                <multiple-line-chart ref="chart9" :chartData="industryRate" :colorList="colorList" :options="lineOptions" :isSmooth="false" />
              </el-col>
            </el-row>
          </div>
          <div v-if="showTabs['2']" class="scroll-item" style="margin-top: 13px">
            <div class="main-title d-flex ai-center scroll-anchor">
              <h3><svg-icon icon-class="community"></svg-icon>固定资产投资</h3>
              <span class="suffix">更新时间：{{ assetsRate.updateTime }}</span>
            </div>
            <el-row v-loading="loading" type="flex" class="shadow-row">
              <el-col :span="24">
                <multiple-line-chart ref="chart10" :chartData="assetsRate" :colorList="colorList" :options="lineOptions" :isSmooth="false" />
              </el-col>
            </el-row>
          </div>
          <div v-if="showTabs['3']" class="scroll-item" style="margin-top: 13px">
            <div class="main-title d-flex ai-center scroll-anchor">
              <h3><svg-icon icon-class="bar-chart-box"></svg-icon>社会消费品零售总额</h3>
              <span class="suffix">更新时间：{{ saleDate }}</span>
            </div>
            <el-row v-loading="loading" type="flex" class="shadow-row">
              <el-col :span="12" class="dashed-right-border">
                <bar-group-chart ref="chart11" :chartData="saleVal" />
              </el-col>
              <el-col :span="12">
                <multiple-line-chart ref="chart12" :chartData="saleRate" :colorList="colorList" :options="lineOptions" :isSmooth="false" />
              </el-col>
            </el-row>
          </div>
          <div v-if="showTabs['4']" class="scroll-item" style="margin-top: 13px">
            <div class="main-title d-flex ai-center scroll-anchor">
              <h3><svg-icon icon-class="bar-chart"></svg-icon>进出口总额</h3>
              <span class="suffix">更新时间：{{ impAndExpDate }}</span>
            </div>
            <el-row v-loading="loading" type="flex" class="shadow-row">
              <el-col :span="12" class="dashed-right-border">
                <bar-group-chart ref="chart13" :chartData="impAndExpVal" />
              </el-col>
              <el-col :span="12">
                <multiple-line-chart ref="chart14" :chartData="impAndExpRate" :colorList="colorList" :options="lineOptions" :isSmooth="false" />
              </el-col>
            </el-row>
          </div>
          <div v-if="showTabs['5']" class="scroll-item" style="margin-top: 13px">
            <div class="main-title d-flex ai-center scroll-anchor">
              <h3><svg-icon icon-class="shopping-bag"></svg-icon>居民收入消费</h3>
              <span class="suffix">更新时间：{{ incomeDate }}</span>
            </div>
            <el-row v-loading="loading" type="flex" class="shadow-row">
              <el-col :span="24" class="dashed-right-border">
                <bar-line-group-chart ref="chart15" :chartData="incomeData" />
              </el-col>
              <el-col :span="24">
                <bar-line-group-chart ref="chart16" :chartData="consumeData" />
              </el-col>
            </el-row>
            <el-row v-loading="loading" type="flex" class="shadow-row">
              <el-col :span="24">
                <bar-group-chart ref="chart17" :chartData="priceIndexVal" :options="{ yAxis: { min: 90, max: 110 } }" />
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex';
import mixinRegion from '@/utils/mixinRegion';
import mixinScroll from '@/utils/mixinScroll';
import mixinResizeChart from '@/utils/mixinResizeChart';
import api from '@/api/economy-monitor';
import BarGroupChart from '@/components/BarGroupChart.vue';
import MultipleLineChart from '@/components/MultipleLineChart';
import BarLineGroupChart from '@/components/BarLineGroupChart.vue';
import MapChart from '@/components/MapChart';

export default {
  name: 'EconomyMonitor',
  components: {
    BarGroupChart,
    MultipleLineChart,
    BarLineGroupChart,
    MapChart
  },
  mixins: [mixinScroll, mixinRegion, mixinResizeChart],
  data() {
    return {
      loading: false,
      chartAmount: 18,
      curRegion: [],
      compareRegions: [],
      colorList: ['#5C82DF', '#E8A961', '#6FCCBB', '#897EDC', '#9ED18C', '#E1789E'],
      scrollOffset: -90,
      tabIndex: 0,
      showTabs: {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true
      },
      renderable: {},
      provinceId: '',
      provinceList: [],
      cityIds: [],
      cityList: [],
      countList: [
        {
          name: '生产总值（GDP）',
          value: '--',
          unit: '亿元',
          grow: '--'
        },
        {
          name: '固定资产投资',
          value: '--',
          unit: '',
          grow: '--'
        },
        {
          name: '社会消费品零售总额',
          value: '--',
          unit: '亿元',
          grow: '--'
        },
        {
          name: '进出口总额',
          value: '--',
          unit: '亿元',
          grow: '--'
        },
        {
          name: '居民消费价格指数',
          value: '--',
          unit: '',
          grow: '--'
        }
      ],
      outputChartData: [],
      gdpDate: '',
      lineOptions: {
        legend: {
          top: 40,
          right: null,
          icon: 'rect',
          itemWidth: 15,
          itemHeight: 2
        },
        grid: {
          top: 100
        },
        axisLabelRotate: 0
      },
      industryVal: {
        title: '规上工业增加值',
        xdata: [],
        ydata: [],
        legend: [],
        unit: '亿元'
      },
      industryRate: {
        title: '规上工业增加值增速',
        xdata: [],
        ydata: [],
        name: [],
        unit: '%'
      },
      industryDate: '',

      assetsRate: {
        title: '固定资产投资增速',
        xdata: [],
        ydata: [],
        name: [],
        unit: '%'
      },
      assetsDate: '',

      saleVal: {
        title: '社会消费品零售总额',
        xdata: [],
        ydata: [],
        legend: [],
        unit: '亿元'
      },
      saleRate: {
        title: '社会消费品零售总额增速',
        xdata: [],
        ydata: [],
        name: [],
        unit: '%'
      },
      saleDate: '',

      impAndExpVal: {
        title: '进出口总额',
        xdata: [],
        ydata: [],
        legend: [],
        unit: '亿元'
      },
      impAndExpRate: {
        title: '进出口总额增速',
        xdata: [],
        ydata: [],
        name: [],
        unit: '%'
      },
      impAndExpDate: '',

      incomeData: JSON.stringify({
        title: '居民人均可支配收入及增速',
        name: [],
        xdata: [],
        unit: [],
        barData: [],
        lineData: []
      }),
      consumeData: JSON.stringify({
        title: '居民人均消费支出及增速',
        name: [],
        xdata: [],
        unit: [],
        barData: [],
        lineData: []
      }),
      incomeDate: '',

      priceIndexVal: {
        title: '居民消费价格指数',
        xdata: [],
        ydata: [],
        legend: [],
        unit: ''
      },
      priceIndexDate: ''
    };
  },
  computed: {
    ...mapGetters(['iep_platform_MENU_ID', 'iep_orgRegion']),
    compareRegionCode() {
      return [this.curRegion[this.curRegion.length - 1]].concat(this.compareRegions.map((r) => r[r.length - 1]));
    },
    disableRegions() {
      return this.compareRegions.map((n) => n[n.length - 1]);
    },
    disableCompareRegions() {
      return [this.curRegion[this.curRegion.length - 1]].concat(this.disableRegions);
    }
  },
  created() {},
  mounted() {
    const { regionPath, regionLevel } = this.iep_orgRegion;
    this.curRegion = regionPath.filter((n, i) => i < (regionLevel === 3 && regionPath.length === 3 ? 2 : 3));
    this.basicStatistics();
    this.getCompareData();
  },
  methods: {
    basicStatistics() {
      const { curRegion } = this;
      api
        .basicStatistics({
          regionCode: curRegion[curRegion.length - 1]
        })
        .then((res) => {
          const rdata = res.data || {};
          const data = {
            ...rdata,
            gdpUnit: rdata.gdpGrowthUnit
          };
          const props = ['gdp', 'fixedAsset', 'retail', 'inexim', 'cpi'];
          props.forEach((n, i) => {
            this.countList[i].value = this.$thousands(Number(data[n]));
            this.countList[i].unit = data[n + 'Unit'] || '';
            this.countList[i].grow = data[n + 'GrowthRate'] === '' || data[n + 'GrowthRate'] === undefined ? '--' : data[n + 'GrowthRate'];
            this.countList[i].date = data[n + 'UpdateTime'] || '';
          });
        });
    },
    getCompareData() {
      this.loading = true;
      this.loadingCount = 0;
      this.gdpCompare();
      this.industryCompare();
      this.fixedAssetCompare();
      this.retailCompare();
      this.ineximCompare();
      this.pcdiCompare();
      this.cpiCompare();
    },
    closeLoading() {
      this.loadingCount += 1;
      this.loading = this.loadingCount < 7;
    },
    formatData(data = {}) {
      return {
        ...data,
        legend: data.regionNames,
        name: data.regionNames,
        xdata: (data.xdata || []).map((n) => {
          n = n.substr(0, 7);
          return n;
        }),
        ydata: data.ydata,
        xData: null,
        yData: null,
        regionNames: null
      };
    },
    gdpCompare() {
      api
        .gdpCompare({
          regionCodes: this.compareRegionCode
        })
        .then(({ data = {} }) => {
          this.outputChartData = ['gdp', 'first', 'second', 'third'].map((n) => {
            return {
              barData: this.formatData(data[n + 'LineResp']),
              lineData: this.formatData({
                ...(data[n + 'GRLineResp'] || {}),
                unit: '%'
              })
            };
          });
          this.gdpDate = data.updateTime;
          this.$nextTick(() => {
            this.resizeChart();
          });
          this.closeLoading();
        })
        .catch(() => {
          this.closeLoading();
        });
    },
    industryCompare() {
      api
        .industryCompare({
          regionCodes: this.compareRegionCode
        })
        .then(({ data = {} }) => {
          this.industryVal = this.formatData(data.lineResp);
          this.industryRate = this.formatData({
            ...data.grLineResp,
            unit: '%'
          });
          this.industryDate = data.updateTime;
          this.closeLoading();
        })
        .catch(() => {
          this.closeLoading();
        });
    },
    fixedAssetCompare() {
      api
        .fixedAssetCompare({
          regionCodes: this.compareRegionCode
        })
        .then(({ data = {} }) => {
          this.assetsRate = this.formatData({
            ...data,
            unit: '%'
          });
          this.closeLoading();
        })
        .catch(() => {
          this.closeLoading();
        });
    },
    retailCompare() {
      api
        .retailCompare({
          regionCodes: this.compareRegionCode
        })
        .then(({ data = {} }) => {
          this.saleVal = this.formatData(data.lineResp);
          this.saleRate = this.formatData({
            ...data.grLineResp,
            unit: '%'
          });
          this.saleDate = data.updateTime;
          this.closeLoading();
        })
        .catch(() => {
          this.closeLoading();
        });
    },
    ineximCompare() {
      api
        .ineximCompare({
          regionCodes: this.compareRegionCode
        })
        .then(({ data = {} }) => {
          this.impAndExpVal = this.formatData(data.lineResp);
          this.impAndExpRate = this.formatData({
            ...data.grLineResp,
            unit: '%'
          });
          this.impAndExpDate = data.updateTime;
          this.closeLoading();
        })
        .catch(() => {
          this.closeLoading();
        });
    },
    pcdiCompare() {
      api
        .pcdiCompare({
          regionCodes: this.compareRegionCode
        })
        .then(({ data = {} }) => {
          const { pcdiIncomeLineResp, pcdiPayOutLineResp } = data;
          this.incomeData = {
            ...pcdiIncomeLineResp,
            name: pcdiIncomeLineResp.regionNames,
            yNames: ['人均可支配收入', '人均可支配收入增速'],
            unit: [pcdiIncomeLineResp.unit, '%'],
            barData: pcdiIncomeLineResp.ydata,
            lineData: pcdiIncomeLineResp.ygrdata
          };
          this.consumeData = {
            ...pcdiPayOutLineResp,
            name: pcdiPayOutLineResp.regionNames,
            yNames: ['人均消费支出', '人均消费支出增速'],
            unit: [pcdiPayOutLineResp.unit, '%'],
            barData: pcdiPayOutLineResp.ydata,
            lineData: pcdiPayOutLineResp.ygrdata
          };
          this.incomeDate = data.updateTime;
          this.closeLoading();
        })
        .catch(() => {
          this.closeLoading();
        });
    },
    cpiCompare() {
      api
        .cpiCompare({
          regionCodes: this.compareRegionCode
        })
        .then(({ data = {} }) => {
          this.priceIndexVal = this.formatData(data);
          this.closeLoading();
        })
        .catch(() => {
          this.closeLoading();
        });
    },
    confirmCompareRegion() {
      this.getCompareData();
    },
    confirmRegion(path, nodes) {
      this.basicStatistics();
      this.getCompareData();
    }
  }
};
</script>
<style lang='less'>
@import '~@/styles/variables.less';
.economy-monitor {
  .scroll-content {
    height: calc(100vh - 62px);
    overflow-y: auto;
  }
  .map-tooltip {
    padding: 10px 24px !important;
    width: 358px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0px 0px 14px 0px rgba(19, 38, 82, 0.08) !important;
    border: none !important;
    color: #86909c !important;
    font-size: 12px !important;
    .item {
      padding: 10px 0;
      border-bottom: 1px dashed #d7d7e8;
      &:last-child {
        border-bottom: none;
      }
    }
    .value {
      color: #4b5666;
      font-family: D-DIN-Bold;
      font-size: 20px;
      font-weight: 700;
    }
  }
  .tabs-row {
    position: sticky;
    top: 0;
    padding: 12px 24px 0;
    background: #fff;
    box-shadow: 0px 0px 16px 0px rgba(20, 38, 82, 0.07);
    z-index: 1;
  }
  .wrap {
    &-top {
      padding: 23px 32px 18px;
      background: #fff;
      box-shadow: 0px 0px 16px 0px rgba(20, 38, 82, 0.07);
    }
    &-body {
      margin-top: 12px;
      &__inner {
        padding: 0 24px 32px;
        .shadow-row:not(:last-child) {
          margin-bottom: 20px;
        }
      }
      .ee-tabs {
        margin-top: 11px;
      }
    }
  }
  .compare-area {
    margin-top: 45px;
  }
  .map-chart-container {
    background: #f1f3f8;
  }
  .map-toggle {
    position: absolute;
    top: 175px;
    font-size: 40px;
    cursor: pointer;
    z-index: 9;
    &:hover {
      opacity: 0.8;
    }
    &.expand {
      display: none;
      top: 255px;
      right: -5px;
    }
  }
  .analysis-type {
    position: absolute;
    z-index: 1;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    .el-radio-button__inner {
      margin: 0 1px;
      padding: 9px 15px;
      border-radius: 2px 2px 0px 0px;
      border: 1px solid #f0f0f0;
      background: #fafafa;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner,
    .el-radio-button__inner:hover {
      color: rgba(53, 109, 246, 1);
      background-color: #fff;
      box-shadow: none;
    }
  }
  .count {
    &-list {
      margin-top: 20px;
    }
    &-box {
      position: relative;
      padding: 20px 30px 5px;
      flex: 1;
      box-sizing: border-box;
      background: #fff;
      border-right: 1px dashed #d7d7e8;
      font-size: 12px;
      color: #86909c;
      &:last-child {
        border-right: 0;
      }
      .title {
        position: relative;
        padding-left: 10px;
        font-size: 14px;
        font-weight: 500;
        color: #1a262c;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 2px;
          height: 14px;
          transform: translateY(-50%);
          background: #356df6;
        }
      }
      .percent {
        margin: 0 3px 0 10px;
        font-family: D-DIN-Bold;
        font-size: 16px;
        font-weight: 700;
        color: #68cd44;
        &.up {
          color: #cc4f47;
        }
      }
      .icon-trend {
        font-size: 46px;
      }
    }
  }
  .money-row {
    margin-top: 26px;
  }
  .money {
    margin: 0 12px 0 10px;
    font-family: D-DIN-Bold;
    font-size: 28px;
    font-weight: 700;
    color: @text-primary;
  }
  .unit {
    color: #4b5666;
    font-size: 14px;
  }
  .trend-row {
    margin-top: 9px;
    &.no-trend {
      .percent {
        color: #86909c;
      }
      .icon-trend {
        margin: 18px 0 17px;
        width: 46px;
        height: 11px;
        box-sizing: border-box;
        border-top: 1px solid #86909c;
        background: linear-gradient(180deg, rgba(134, 144, 156, 0.2) 0%, rgba(134, 144, 156, 0) 100%);
      }
    }
  }
  .el-icon-top {
    color: red;
    font-weight: bold;
  }
}
</style>
