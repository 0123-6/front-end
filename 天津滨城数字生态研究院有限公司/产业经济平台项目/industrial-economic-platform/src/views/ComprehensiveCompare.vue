<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-01-04 14:10:59
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-07-19 14:54:11
 * @FilePath: \smart search web\src\views\home-page\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="home-container comprehensive-comparison-page">
    <div class="main-container">
      <el-container>
        <el-aside v-loading="loading" element-loading-custom-class="ee-loading--none" class="d-flex flex-y" width="240px">
          <el-breadcrumb class="ee-breadcrumb" separator="/" style="margin: 20px 0 10px 20px">
            <el-breadcrumb-item>产业分析</el-breadcrumb-item>
            <el-breadcrumb-item class="is-active">产业综合对比</el-breadcrumb-item>
          </el-breadcrumb>
          <el-select v-model="industrialType" placeholder="请选择" @change="changeIndustrialType">
            <el-option v-for="item in chainList" :key="item.chainCode" :label="item.name" :value="item.chainCode"> </el-option>
          </el-select>
          <el-tree
            ref="analyseItemsTreeEL"
            class="flex-1"
            :data="analyseItemsOptions"
            :props="defaultProps"
            @check="changeAnalyseItems"
            default-expand-all
            show-checkbox
            node-key="itemCode"
            style="margin-top: 15px; width: 100%"></el-tree>
        </el-aside>
        <el-main class="d-flex flex-y">
          <div v-loading="loading" element-loading-custom-class="ee-loading--none" class="region-box d-flex ai-center">
            <div class="d-flex ai-center">
              当前区域：
              <ee-cascader
                class="flex-1"
                v-model="selectRegion"
                placeholder="全部"
                :options="regionTree"
                :multiple="false"
                :clearable="false"
                autoResize
                @change="changeRegion" />
            </div>
            <!-- <el-button class="primary plain">数据下载</el-button> -->
          </div>
          <div
            v-if="enterpriseTypeId.length === 0 && copyrightTypeId.length === 0 && investTypeId.length === 0"
            class="no-data-content flex-1 flex-center ai-center">
            <svg-icon icon-class="noData"></svg-icon>
          </div>
          <div v-else v-loading="loading" class="chart-content flex-1">
            <el-row class="shadow-row" v-for="(value, key) in enterpriseTypeChartData" :key="key" v-show="!!value">
              <template v-if="!!value">
                <el-col :span="24">
                  <MultipleLineChart ref="chart0" :chartData="value" symbol="circle" :isSmooth="false" :options="chartOptions">
                    <div class="d-flex ai-center flex-1 region-tool">
                      <ee-cascader
                        class="flex-1"
                        v-model="regionModels[key]"
                        placeholder="添加对比区域"
                        mode="button"
                        :options="regionTree"
                        direction="reverse"
                        :disableValues="disableRegions"
                        clearable
                        :limit="10" />
                      <el-button
                        class="ee-button"
                        type="primary"
                        size="small"
                        @click="changeSingleEnterpriseTypeChart(regionModels[key] || [], value, key)"
                        style="margin-left: 10px">
                        确定
                      </el-button>
                    </div>
                  </MultipleLineChart>
                </el-col>
                <el-col
                  :span="24"
                  class="remark"
                  v-if="value.remark?.length > 0"
                  v-loading="value.remark?.length === 0"
                  element-loading-text="数据分析中">
                  <div>
                    <div class="title">数据解释：</div>
                    <div class="ul-title">{{ value.remark[0] }}</div>
                    <ul>
                      <template v-for="(item, index) of value.remark">
                        <li v-if="index > 0" :key="index">{{ item }}</li>
                      </template>
                    </ul>
                  </div>
                </el-col>
              </template>
            </el-row>
            <el-row class="shadow-row" v-for="(value, key) in copyrightTypeChartData" :key="key" v-show="!!value">
              <template v-if="!!value">
                <el-col :span="24">
                  <MultipleLineChart ref="chart1" :chartData="value" symbol="circle" :isSmooth="false" :options="chartOptions">
                    <div class="d-flex ai-center flex-1 region-tool">
                      <ee-cascader
                        class="flex-1"
                        v-model="regionModels[key]"
                        placeholder="添加对比区域"
                        mode="button"
                        :options="regionTree"
                        direction="reverse"
                        :disableValues="disableRegions"
                        clearable
                        :limit="10" />
                      <el-button
                        class="ee-button"
                        type="primary"
                        size="small"
                        @click="changeSingleEnterpriseTypeChart(regionModels[key] || [], value, key)"
                        style="margin-left: 10px">
                        确定
                      </el-button>
                    </div>
                  </MultipleLineChart>
                </el-col>
                <el-col
                  :span="24"
                  class="remark"
                  v-if="value.remark?.length > 0"
                  v-loading="value.remark?.length === 0"
                  element-loading-text="数据分析中">
                  <div>
                    <div class="title">数据解释：</div>
                    <div class="ul-title">{{ value.remark[0] }}</div>
                    <ul>
                      <template v-for="(item, index) of value.remark">
                        <li v-if="index > 0" :key="index">{{ item }}</li>
                      </template>
                    </ul>
                  </div>
                </el-col>
              </template>
            </el-row>
            <el-row class="shadow-row" v-for="(value, key) in investTypeChartData" :key="key" v-show="!!value">
              <template v-if="!!value">
                <el-col :span="24">
                  <BarGroupChart ref="chart2" :chartData="value" symbol="circle" :isSmooth="false" :options="chartOptions">
                    <div class="d-flex ai-center flex-1 region-tool">
                      <ee-cascader
                        class="flex-1"
                        v-model="regionModels[key]"
                        placeholder="添加对比区域"
                        mode="button"
                        :options="regionTree"
                        direction="reverse"
                        :disableValues="disableRegions"
                        clearable
                        :limit="10" />
                      <el-button
                        class="ee-button"
                        type="primary"
                        size="small"
                        @click="changeSingleEnterpriseTypeChart(regionModels[key] || [], value, key)"
                        style="margin-left: 10px">
                        确定
                      </el-button>
                    </div>
                  </BarGroupChart>
                </el-col>
                <el-col
                  :span="24"
                  class="remark"
                  v-if="value.remark?.length > 0"
                  v-loading="value.remark?.length === 0"
                  element-loading-text="数据分析中">
                  <div>
                    <div class="title">数据解释：</div>
                    <div class="ul-title">{{ value.remark[0] }}</div>
                    <ul>
                      <template v-for="(item, index) of value.remark">
                        <li v-if="index > 0" :key="index">{{ item }}</li>
                      </template>
                    </ul>
                  </div>
                </el-col>
              </template>
            </el-row>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { mapGetters } from 'vuex';
import mixinRegion from '@/utils/mixinRegion';
import mixinChain from '@/utils/mixinChain';
import mixinResizeChart from '@/utils/mixinResizeChart';
import { comparisonApis } from '@/api/comprehensive-comparison';
import MultipleLineChart from '@/components/MultipleLineChart';
import BarGroupChart from '@/components/BarGroupChart.vue';

const unitMap = {
  companyNum: '家',
  newlyCompany: '家',
  revokeCompany: '家',
  companyAge: '家',
  threeSurvialRate: '%',
  fiveSurvialRate: '%',
  deathRate: '%',
  patent: '件',
  copyright: '件',
  trademarkReg: '件',
  financingAmountData: '亿元',
  financingEventData: '次'
};

export default {
  name: 'ComprehensiveComparison',
  components: {
    MultipleLineChart,
    BarGroupChart
  },
  mixins: [mixinRegion, mixinChain, mixinResizeChart],
  computed: {
    ...mapGetters(['iep_platform_MENU_ID', 'iep_orgRegion']),
    disableRegions() {
      const { selectRegion } = this;
      return selectRegion.length > 0 ? [selectRegion[selectRegion.length - 1]] : [];
    },
    loading() {
      return this.loadings.enterpriseTypeChartData || this.loadings.copyrightTypeChartData || this.loadings.investTypeChartData;
    }
  },
  data() {
    return {
      chartAmount: 3,
      regionModels: {},
      industrialType: '',
      analyseItemsOptions: [],
      analyseItems: [],
      defaultProps: {
        children: 'children',
        label: 'itemName'
      },
      selectRegion: [],
      enterpriseTypeId: [],
      copyrightTypeId: [],
      investTypeId: [],
      enterpriseTypeChartData: {},
      copyrightTypeChartData: {},
      investTypeChartData: {},
      chartOptions: {
        domTitle: true,
        title: {
          show: false
        },
        grid: {
          top: 40
        },
        legend: {
          top: 0
        }
      },
      loadings: {
        enterpriseTypeChartData: false,
        copyrightTypeChartData: false,
        investTypeChartData: false
      }
    };
  },
  created() {},
  mounted() {
    this.selectRegion = this.iep_orgRegion.regionPath;
    this.oldCompanyParams = [];
    this.oldCopyrightParams = [];
    this.oldInvestParams = [];
    this.getAnalyseItemsData();
  },
  methods: {
    afterChainListLoad() {
      this.industrialType = this.chainList[0].chainCode;
    },
    // 分析选项数据
    getAnalyseItemsData() {
      const dataPropMap = {
        1: 'enterpriseTypeChartData',
        2: 'copyrightTypeChartData',
        3: 'investTypeChartData'
      };
      comparisonApis
        .getAnalyseItems()
        .then((result) => {
          this.analyseItemsOptions = result.data;
          // 先初始化属性，固定顺序
          this.analyseItemsOptions.forEach((n) => {
            n.children.forEach((c) => {
              this.$set(this[dataPropMap[n.itemType]], c.itemCode, null);
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 修改分析选项
    changeAnalyseItems() {
      const nodes = this.$refs.analyseItemsTreeEL.getCheckedNodes();
      const enterpriseTypeId = [];
      const copyrightTypeId = [];
      const investTypeId = [];
      nodes.forEach((item) => {
        if (item.parentId !== 0) {
          if (item.itemType === 1) {
            const index = this.enterpriseTypeId.findIndex((el) => el.name === item.itemCode);
            if (index < 0) {
              enterpriseTypeId.push({ name: item.itemCode, regionCodes: [] });
            } else {
              enterpriseTypeId.push({ name: item.itemCode, regionCodes: this.enterpriseTypeId[index].regionCodes });
            }
          } else if (item.itemType === 2) {
            const index = this.copyrightTypeId.findIndex((el) => el.name === item.itemCode);
            if (index < 0) {
              copyrightTypeId.push({ name: item.itemCode, regionCodes: [] });
            } else {
              copyrightTypeId.push({ name: item.itemCode, regionCodes: this.copyrightTypeId[index].regionCodes });
            }
          } else if (item.itemType === 3) {
            const index = this.investTypeId.findIndex((el) => el.name === item.itemCode);
            if (index < 0) {
              investTypeId.push({ name: item.itemCode, regionCodes: [] });
            } else {
              investTypeId.push({ name: item.itemCode, regionCodes: this.investTypeId[index].regionCodes });
            }
          }
        }
      });
      this.enterpriseTypeId = enterpriseTypeId;
      this.copyrightTypeId = copyrightTypeId;
      this.investTypeId = investTypeId;
      this.getEnterpriseComparisonData();
      this.getCopyrightComparisonData();
      this.getInvestComparisonData();
    },
    // 修改产业链
    changeIndustrialType() {
      this.clearOldParams();
      this.getEnterpriseComparisonData();
      this.getCopyrightComparisonData();
      this.getInvestComparisonData();
    },
    // 修改区域
    changeRegion() {
      this.clearOldParams();
      this.getEnterpriseComparisonData();
      this.getCopyrightComparisonData();
      this.getInvestComparisonData();
    },
    clearOldParams() {
      this.oldCompanyParams = [];
      this.oldCopyrightParams = [];
      this.oldInvestParams = [];
    },
    // 添加对比区域
    changeSingleEnterpriseTypeChart(path, value, key) {
      const formatPath = path.map((p) => p[p.length - 1]);
      if (value.itemType === 1) {
        const index = this.enterpriseTypeId.findIndex((item) => item.name === key);
        this.enterpriseTypeId[index].regionCodes = formatPath;
        this.getEnterpriseComparisonData();
      } else if (value.itemType === 2) {
        const index = this.copyrightTypeId.findIndex((item) => item.name === key);
        this.copyrightTypeId[index].regionCodes = formatPath;
        this.getCopyrightComparisonData();
      } else if (value.itemType === 3) {
        const index = this.investTypeId.findIndex((item) => item.name === key);
        this.investTypeId[index].regionCodes = formatPath;
        this.getInvestComparisonData();
      }
    },
    getRealParams(chartDataProp, nodeProp, oldParamProp) {
      const analyseItems = [];
      Object.keys(this[chartDataProp]).forEach((key) => {
        // 左侧统计类型节点未选中，删除图表数据
        if (!this[nodeProp].find((n) => n.name === key)) {
          this[chartDataProp][key] = null;
          this[oldParamProp] = this[oldParamProp].filter((n) => n.name !== key);
        }
      });
      this[nodeProp].forEach((newParams) => {
        let oldParams = this[oldParamProp].find((n) => n.name === newParams.name);
        // 左侧类型节点未查询过或参数变化，则加入查询范围
        if (!oldParams || JSON.stringify(oldParams) !== JSON.stringify(newParams)) {
          analyseItems.push(newParams);
        }
      });
      return analyseItems;
    },
    getDataCommon(chartDataProp, nodeProp, oldParamProp, apiName) {
      const analyseItems = this.getRealParams(chartDataProp, nodeProp, oldParamProp);
      const { selectRegion } = this;
      const params = {
        regionCode: selectRegion[selectRegion.length - 1],
        regionLevel: this.$getLevelByCode(selectRegion[selectRegion.length - 1]),
        analyseItems,
        chainCode: this.industrialType
      };
      this.loadings[chartDataProp] = true;
      comparisonApis[apiName](params)
        .then((result) => {
          let data = result.data;
          Object.keys(data).forEach((key) => {
            const { length } = data[key].ydata.filter((u) => u.length === 0);
            if (data[key].ydata.length - 1 !== length && data[key].ydata.length > 1) {
              data[key].remark = [];
              // this.getAiModelAnalyseData(data[key]);
            }
            this.$set(this[chartDataProp], key, {
              unit: unitMap[key],
              legend: data[key].name,
              ...data[key]
            });
          });
          this[oldParamProp] = JSON.parse(JSON.stringify(this[nodeProp]));
          this.loadings[chartDataProp] = false;
        })
        .catch((err) => {
          this.loadings[chartDataProp] = false;
          console.log(err);
        });
    },
    // 企业分析查询
    getEnterpriseComparisonData() {
      this.getDataCommon('enterpriseTypeChartData', 'enterpriseTypeId', 'oldCompanyParams', 'getEnterpriseComparison');
    },
    // 知识产权查询
    getCopyrightComparisonData() {
      this.getDataCommon('copyrightTypeChartData', 'copyrightTypeId', 'oldCopyrightParams', 'getCopyrightComparison');
    },
    // 投融资查询
    getInvestComparisonData() {
      this.getDataCommon('investTypeChartData', 'investTypeId', 'oldInvestParams', 'getInvestComparison');
    },
    // 数据解析
    getAiModelAnalyseData(params) {
      comparisonApis
        .getAiModelAnalyse(params)
        .then((result) => {
          params.remark = JSON.parse(result.data).data.split('\n\n');
          this.$forceUpdate();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less">
@import '~@/styles/variables.less';
.comprehensive-comparison-page {
  min-height: 100%;
  .ee-cascader {
    flex-direction: row-reverse;
    .value-list {
      justify-content: flex-end;
    }
  }
  .ee-chart {
    &.is-empty {
      .region-tool {
        display: none;
      }
    }
  }
  .main-container {
    .el-aside {
      background-color: #ffffff;
      box-shadow: 5px 0px 16px rgba(20, 38, 82, 0.07);
      height: calc(100vh - 62px);
      .el-select {
        padding: 0 20px 13px;
        &::after {
          position: absolute;
          content: '';
          width: calc(100% - 40px);
          height: 1px;
          bottom: 0;
          background: #c3cddb;
          left: 20px;
        }
      }
      .el-tree {
        overflow: auto;
        .el-tree-node {
          padding: 8px 0px;
        }
      }
    }
    .el-main {
      padding: 0;
      height: calc(100vh - 62px);
      .region-box {
        position: relative;
        z-index: 1;
        height: 68px;
        background-color: #ffffff;
        padding: 0 32px;
        width: 100%;
        box-sizing: border-box;
        box-shadow: 0px 0px 16px rgba(20, 38, 82, 0.07);
        color: @text-light;
      }
      .shadow-row {
        background-color: #ffffff;
        box-shadow: 0px 0px 14px rgba(19, 38, 82, 0.08);
        & + .shadow-row {
          margin-top: 16px;
        }
      }
      .chart-content {
        padding: 24px;
        width: 100%;
        box-sizing: border-box;
        position: relative;
        overflow-x: hidden;
        overflow-y: auto;
        .remark {
          padding: 16px 48px;
          & > div {
            background-color: #f2f2f2;
            padding: 24px 32px;
          }
          .title {
            font-size: 18px;
            color: #1a262c;
          }
          .ul-title {
            font-size: 14px;
            color: #86909c;
            margin-top: 12px;
          }
          li {
            font-size: 14px;
            color: #86909c;
          }
        }
      }
      .no-data-content {
        width: 100%;
        .svg-icon {
          width: 400px;
          height: 300px;
        }
      }
    }
  }
}
</style>
