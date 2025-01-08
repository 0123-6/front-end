<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-01-04 14:10:59
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-07-19 15:40:40
 * @FilePath: \smart search web\src\views\home-page\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="page-IndustryMapDetail">
    <div class="main-container">
      <el-container>
        <el-main class="d-flex flex-y">
          <div class="breadcrumb-nav">
            <div class="region-box d-flex ai-center jc-between">
              <div v-loading="loading" element-loading-custom-class="ee-loading--none" class="region-box d-flex ai-center">
                <span>产业：</span>
                <el-select v-model="chainId" placeholder="请选择" @change="init">
                  <el-option
                    v-for="item in chainTypeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="item.authorized === false">
                  </el-option>
                </el-select>
                <span style="margin-left: 50px">区域：</span>
                <ee-cascader
                  ref="CascaderSelect"
                  v-model="selectRegion"
                  placeholder="全部"
                  :options="regionTree"
                  :multiple="false"
                  autoResize
                  @change="init" />
              </div>
              <!-- <el-link
                class="ee-link ell"
                type="primary"
                :underline="false"
                href="http://economy.zhishu-tech.com/api/user/user/downloadPdf"
                target="_blank">
                下载报告
              </el-link> -->
            </div>
            <div class="main-tab">
              <el-tabs class="ee-tabs" v-model="tabIndex" @tab-click="handleScroll">
                <el-tab-pane v-for="(n, i) in tabs.filter((t) => t.isShow)" :key="n.title" :label="n.title" :name="i.toString()"></el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div class="chart-content flex-1 scroll-content">
            <component
              v-for="n in tabs.filter((t) => t.isShow)"
              :key="n.title"
              :is="n.component"
              :ref="n.component"
              :title="n.title"
              :loading="loading"
              :params="n.component === 'IndustryChain' ? chainParams : baseParams"
              @changeChainCode="changeChainCode"
              @loading="handleLoading" />
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex';
import mixinRegion from '@/utils/mixinRegion';
import mixinScroll from '@/utils/mixinScroll';
import mixinTabs from '@/utils/mixinTabs';
import mixinResizeChart from '@/utils/mixinResizeChart';
import mixinOpenWindow from '@/utils/mixinOpenWindow';
import { resizeChart } from '@/utils';
import { comparisonApis } from '@/api/comprehensive-comparison';
import IndustryChain from '@/views/chart/IndustryChain.vue';
import EnterpriseAnalysis from '@/views/chart/EnterpriseAnalysis.vue';
import TechInnovation from '@/views/chart/TechInnovation.vue';
import CompanyRegionDist from '@/views/chart/CompanyRegionDist.vue';
import InvestAnalysis from '@/views/chart/InvestAnalysis.vue';
import Development from '@/views/chart/Development.vue';

export default {
  name: 'IndustryMapDetail',
  mixins: [mixinRegion, mixinScroll, mixinTabs, mixinResizeChart, mixinOpenWindow],
  components: {
    IndustryChain,
    EnterpriseAnalysis,
    TechInnovation,
    CompanyRegionDist,
    InvestAnalysis,
    Development
  },
  computed: {
    ...mapGetters(['iep_platform_ROUTERS_INFO', 'iep_platform_MENU_ID', 'iep_orgRegion']),
    loading() {
      return this.loadings > 0;
    }
  },
  data() {
    return {
      scrollOffset: -135,
      chainId: '',
      chainTypeOptions: [],
      chainCode: '',
      selectRegion: [],
      tabIndex: '0',
      tabs: [
        {
          isShow: false,
          title: '图谱',
          component: 'IndustryChain'
        },
        {
          isShow: false,
          title: '企业分析',
          component: 'EnterpriseAnalysis'
        },
        {
          isShow: false,
          title: '技术创新',
          component: 'TechInnovation'
        },
        {
          isShow: false,
          title: '区域分布',
          component: 'CompanyRegionDist'
        },
        {
          isShow: false,
          title: '投融资',
          component: 'InvestAnalysis'
        },
        {
          isShow: false,
          title: '发展力评估',
          component: 'Development'
        }
      ],
      baseParams: {},
      chainParams: {},
      loadings: 0
    };
  },
  mounted() {
    this.selectRegion = [].concat(this.iep_orgRegion.regionPath);
    this.chainId = this.$route.params.id * 1;
    this.getChainListData();
  },
  activated() {
    const { id } = this.$route.params;
    if (this.isActivated && id != this.chainId) {
      this.chainId = id * 1;
      this.getChainListData();
    }
    this.isActivated = true;
    this.$nextTick(() => {
      this.handleScroll({ index: this.tabIndex });
    });
  },
  methods: {
    handleDownload() {
      const imgs = [];
      imgs.push(this.$refs.baseTree.graph.toDataURL());
      for (let i = 1; i < 25; i += 1) {
        const ref = this.$refs[`chart${i}`];
        if (ref && ref.chart) {
          imgs.push(ref.chart.getDataURL());
        } else {
          imgs.push('');
        }
      }
      console.log(JSON.stringify(imgs));
    },
    // 产业链数据
    getChainListData() {
      const params = {
        menuId: this.iep_platform_MENU_ID
      };
      comparisonApis
        .getChainList(params)
        .then((result) => {
          this.chainTypeOptions = result.data.list;
          this.init();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getBaseParams() {
      const { selectRegion, chainId, chainCode } = this;
      const regionCode = selectRegion[selectRegion.length - 1];
      const regionLevel = this.$getLevelByCode(regionCode);
      this.baseParams = {
        regionCode,
        regionLevel,
        chainCode
      };
      this.chainParams = {
        chainId,
        chainCode,
        regionCode,
        regionLevel
      };
    },
    changeChainCode(code) {
      this.chainCode = `${code}`;
      this.getBaseParams();
    },
    handleLoading(e) {
      this.loadings += e;
    },
    init() {
      this.chainCode = this.chainTypeOptions.find((item) => item.id === this.chainId).chainCode;
      this.getBaseParams();
    },
    customResize() {
      this.tabs
        .filter((n) => n.isShow)
        .forEach((n) => {
          resizeChart(this.$refs[n.component][0]);
        });
    }
  }
};
</script>

<style lang="less">
@import '~@/styles/variables.less';
.page-IndustryMapDetail {
  min-height: 100%;
  .scroll-content {
    overflow-x: hidden;
    overflow-y: auto;
  }
  .main-container {
    .el-main {
      padding: 0;
      height: calc(100vh - 62px);
      .breadcrumb-nav {
        position: relative;
        z-index: 1;
        width: 100%;
        box-sizing: border-box;
        background-color: #ffffff;
        padding: 0 32px;
        box-shadow: 0px 0px 16px 0px rgba(20, 38, 82, 0.07);
        .region-box {
          height: 76px;
          color: @text-light;
        }
      }
      .chart-content {
        padding: 0 24px 24px;
        width: 100%;
        box-sizing: border-box;
        .line-title {
          .svg-icon {
            margin-right: 8px;
          }
        }
      }
    }
  }
  .el-table th.el-table__cell > .cell.highlight {
    color: @primary-color;
    font-weight: 700;
  }
  .el-table .ascending .sort-caret.ascending {
    border-bottom-color: #356df6;
  }
  .el-table .descending .sort-caret.descending {
    border-top-color: #356df6;
  }
}
</style>
