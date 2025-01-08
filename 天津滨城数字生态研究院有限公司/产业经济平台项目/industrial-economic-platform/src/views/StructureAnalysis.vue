<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-01-04 14:10:59
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-07-18 18:01:57
 * @FilePath: \smart search web\src\views\home-page\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="page-StructureAnalysis">
    <div class="main-container">
      <el-container>
        <el-aside v-loading="loading" element-loading-custom-class="ee-loading--none" class="d-flex flex-y" width="240px">
          <el-breadcrumb class="ee-breadcrumb" separator="/">
            <el-breadcrumb-item>产业分析</el-breadcrumb-item>
            <el-breadcrumb-item class="is-active">产业结构分析</el-breadcrumb-item>
          </el-breadcrumb>
          <ee-cascader
            ref="CascaderSelect"
            v-model="selectRegion"
            width="200px"
            placeholder="全部"
            :options="regionTree"
            :multiple="false"
            @change="changeRegion" />
          <el-tree
            ref="industryTreeEL"
            class="flex-1"
            :data="industryType"
            :props="defaultProps"
            @node-click="changeIndustryType"
            default-expand-all
            node-key="industryCode"
            :current-node-key="industryCode"
            style="margin-top: 20px; width: 100%">
            <span class="span-ellipsis" slot-scope="{ node, data }">
              <span v-if="data.children" :title="node.label">
                <svg-icon
                  v-if="
                    data.industryCode === 'allIndustry' ||
                    data.industryCode === 'first_industry' ||
                    data.industryCode === 'second_industry' ||
                    data.industryCode === 'third_industry'
                  "
                  :icon-class="data.icon"></svg-icon>
                {{ node.label }}</span
              >
              <span v-else>
                <svg-icon :icon-class="data.icon"></svg-icon>
                {{ node.label }}
              </span>
            </span>
          </el-tree>
        </el-aside>
        <el-main class="d-flex flex-y">
          <div class="breadcrumb-nav">
            <div style="overflow: hidden">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item, index) of breadcrumbList" :key="item.code">
                  <span v-if="breadcrumbList.length - 1 === index" style="color: #356df6; font-weight: 500; font-size: 16px">{{ item.name }}</span>
                  <span v-else>{{ item.name }}</span>
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <el-tabs class="ee-tabs" v-model="tabIndex" @tab-click="handleScroll">
              <el-tab-pane v-for="(n, i) in tabs.filter((t) => t.isShow)" :key="n.title" :label="n.title" :name="i.toString()"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="chart-content flex-1 scroll-content">
            <component
              v-for="n in tabs.filter((t) => t.isShow)"
              :key="n.title"
              :is="n.component"
              :ref="n.component"
              :title="n.title"
              :params="baseParams"
              mode="structure"
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
import { resizeChart } from '@/utils';
import { analysisApis } from '@/api/structural-analysis';
import EnterpriseAnalysis from '@/views/chart/EnterpriseAnalysis.vue';
import TechInnovation from '@/views/chart/TechInnovation.vue';
import CompanyRegionDist from '@/views/chart/CompanyRegionDist.vue';
import InvestAnalysis from '@/views/chart/InvestAnalysis.vue';

const industryIcons = {
  allIndustry: 'general-view',
  first_industry: 'primary-industry',
  second_industry: 'secondary-industry',
  third_industry: 'tertiary-industry'
};

export default {
  name: 'StructuralAnalysis',
  mixins: [mixinScroll, mixinRegion, mixinTabs, mixinResizeChart],
  components: {
    EnterpriseAnalysis,
    TechInnovation,
    CompanyRegionDist,
    InvestAnalysis
  },
  computed: {
    ...mapGetters(['iep_platform_ROUTERS_INFO', 'iep_platform_MENU_ID', 'iep_orgRegion']),
    loading() {
      return this.loadings > 0;
    }
  },
  data() {
    return {
      chartAmount: 0,
      scrollOffset: -107,
      selectRegion: [],
      tabIndex: '0',
      tabs: [
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
        }
      ],
      industryType: [],
      defaultProps: {
        children: 'children',
        label: 'industryName'
      },
      breadcrumbList: [
        {
          code: '-allIndustry',
          name: '总览'
        }
      ],
      industryCode: 'allIndustry',
      baseParams: {},
      loadings: 0
    };
  },
  created() {
    this.getIndustryItemsData();
  },
  mounted() {
    this.selectRegion = [].concat(this.iep_orgRegion.regionPath);
    this.init();
  },
  activated() {
    this.$nextTick(() => {
      this.handleScroll({ index: this.tabIndex });
    });
  },
  methods: {
    // 产业总览
    getIndustryItemsData() {
      analysisApis
        .getIndustryItems()
        .then((result) => {
          this.industryType = result.data;
          this.industryType.forEach((item) => {
            if (industryIcons[item.industryCode]) {
              item.icon = industryIcons[item.industryCode];
            }
          });
          this.$nextTick(() => {
            this.$refs.industryTreeEL.setCheckedKeys(['allIndustry']);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleLoading(e) {
      this.loadings += e;
    },
    init() {
      const { selectRegion, industryCode } = this;
      const regionCode = selectRegion[selectRegion.length - 1];
      this.baseParams = {
        regionCode,
        regionLevel: this.$getLevelByCode(regionCode),
        industryCode
      };
    },
    // 切换区域
    changeRegion() {
      this.init();
    },
    // 切换产业
    changeIndustryType(data) {
      // 最后一层子节点才触发数据变化
      if (!data.children) {
        const breadcrumbList = [];
        this.industryCode = data.industryCode;
        if (data.industryCode === 'allIndustry') {
          this.breadcrumbList = [];
        } else {
          this.breadcrumbList = this.getTreeNode(this.$refs.industryTreeEL.getNode(this.industryCode), breadcrumbList);
        }

        this.breadcrumbList.unshift({
          code: '-allIndustry',
          name: '总览'
        });
        this.init();
      }
    },
    // 树节点获取
    getTreeNode(node, list) {
      if (node) {
        if (node.parent) {
          list.unshift({
            code: node.data.industryCode,
            name: node.data.industryName
          });
          this.getTreeNode(node.parent, list);
        } else {
          return list;
        }
      }
      return list;
    },
    customResize() {
      this.tabs
        .filter((n) => n.isShow)
        .forEach((n) => {
          const { customResize } = this.$refs[n.component][0];
          customResize && customResize();
          resizeChart(this.$refs[n.component][0]);
        });
    }
  }
};
</script>

<style lang="less">
@import '~@/styles/variables.less';
.page-StructureAnalysis {
  min-height: 100%;
  .ee-breadcrumb {
    margin: 20px 0 10px 20px;
  }
  .ee-cascader {
    position: relative;
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
  .scroll-content {
    overflow-x: hidden;
    overflow-y: auto;
  }
  .main-container {
    .el-aside {
      height: calc(100vh - 62px);
      background-color: #ffffff;
      box-shadow: 5px 0px 16px rgba(20, 38, 82, 0.07);
      z-index: 9;
      .el-tree {
        overflow: auto;
        .span-ellipsis {
          width: calc(100% - 32px);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 14px;
          color: #1a262c;
        }
      }
    }
    .el-main {
      padding: 0;
      height: calc(100vh - 62px);
      .breadcrumb-nav {
        position: relative;
        z-index: 1;
        background-color: #ffffff;
        padding-left: 32px;
        box-shadow: 0px 0px 16px rgba(20, 38, 82, 0.07);
        width: 100%;
        box-sizing: border-box;

        .el-breadcrumb {
          height: 48px;
          line-height: 48px;
          .el-breadcrumb__inner {
            color: @text-light;
          }
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
  .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
  .el-tree-node__content {
    height: 36px;
  }
  .el-aside .el-tree .span-ellipsis {
    color: #4b5666 !important;
  }
  .el-tree-node.is-current > .el-tree-node__content {
    background: rgba(53, 109, 246, 0.2);
    border-right: 2px solid#356DF6;
    color: #356df6;
    .el-tree-node__expand-icon {
      color: #356df6;
    }
    .is-leaf {
      color: rgba(0, 0, 0, 0);
    }
    .span-ellipsis {
      span {
        color: #356df6;
      }
    }
  }
  .el-table .ascending .sort-caret.ascending {
    border-bottom-color: #356df6;
  }
  .el-table .descending .sort-caret.descending {
    border-top-color: #356df6;
  }
}
</style>
