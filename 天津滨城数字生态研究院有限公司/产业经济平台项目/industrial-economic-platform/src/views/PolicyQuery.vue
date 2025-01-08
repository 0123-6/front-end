<template>
  <div class="page-policy-query">
    <el-breadcrumb class="ee-breadcrumb fixed-top-left" separator="/">
      <el-breadcrumb-item>产业政策</el-breadcrumb-item>
      <el-breadcrumb-item class="is-active">政策查询</el-breadcrumb-item>
    </el-breadcrumb>
    <policy-query-head @regionTreeLoaded="regionTreeLoaded" @search="goList" />
    <div class="wrap-inner">
      <div class="wrap-chart">
        <div class="chart-title">政策数据中心</div>
        <MapChart
          ref="chart0"
          :chartData="mapData"
          height="100%"
          :tooltip="mapTooltip"
          :toolbox="{ left: 30, top: 100 }"
          :visualMap="{ left: 80, bottom: 80, text: ['     （条）', ''], itemGap: 13, itemWidth: 14, itemHeight: 14 }"
          :pieceColors="['#E3ECF6', '#D5E2FC', '#A6DFFC', '#5098F8', '#5E86F3']"
          :minLevel="1"
          @level-change="changeMapLevel"></MapChart>
      </div>
      <div class="wrap-list">
        <div class="wrap-list__top d-flex ai-center jc-between">
          <div v-loading="loading" element-loading-custom-class="ee-loading--none" class="d-flex ai-center">
            <div class="title">政策文件</div>
            <div class="ee-ilabel">区 域：</div>
            <ee-cascader
              ref="EeCascader"
              v-model="curRegion"
              placeholder="全部"
              :options="regionTree"
              :multiple="false"
              :max-level="2"
              autoResize
              @change="confirmRegion" />
          </div>
          <el-button class="ee-button--back" type="text" @click="viewMore">更多<i class="el-icon-arrow-right"></i></el-button>
        </div>
        <div v-loading="loading" class="wrap-list__body">
          <el-row :gutter="20">
            <el-col :span="6" v-for="n in policyCategories" :key="n.value">
              <div class="d-flex ai-center col-title">
                <svg-icon :icon-class="'policy-type-' + n.value" />
                <span>{{ n.text }}</span>
              </div>
              <div class="wrap-list__col" :class="{ 'none-new': !tableData[n.value].find((m) => m.is_new) }">
                <div v-for="m in tableData[n.value]" :key="m.id" class="wrap-list__item d-flex ai-center" @click="handleDetail(m)">
                  <div class="area">【{{ m.area }}】</div>
                  <div class="name flex-1 ell" :title="m.title">{{ m.title }}</div>
                  <div class="date">{{ m.publish_date }}</div>
                  <div class="icon-new flex-center" :style="{ visibility: !m.is_new ? 'hidden' : 'visible' }">
                    <div>NEW</div>
                  </div>
                  <i class="el-icon-arrow-right"></i>
                </div>
                <div v-show="tableData[n.value].length === 0" class="ee-nodata--small">暂无数据</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex';
import mixinResizeChart from '@/utils/mixinResizeChart';
import mixinScrollMemory from '@/utils/mixinScrollMemory';
import * as api from '@/api/policy';
import { policyCategories } from '@/utils/constant';
import PolicyQueryHead from './PolicyQueryHead.vue';
import MapChart from '@/components/MapChart';

const defaultData = () => {
  return {
    government: [],
    department: [],
    regulation: [],
    park: []
  };
};

export default {
  name: 'PolicyList',
  components: {
    PolicyQueryHead,
    MapChart
  },
  mixins: [mixinResizeChart, mixinScrollMemory],
  data() {
    return {
      chartAmount: 1,
      curRegion: [],
      policyCategories,
      loading: false,
      tableData: defaultData(),
      regionTree: [],
      mapData: {
        code: 'china',
        name: '中国',
        min: 0,
        max: 0,
        pieceNum: 5,
        unit: '条',
        data: []
      },
      mapAllData: {},
      regionData: [],
      mapTooltip: {
        trigger: 'item',
        renderMode: 'html',
        className: 'policy-map-tooltip',
        formatter: (params, ticket, callback) => {
          const { value, data = {} } = params;
          // console.log('policy map', params);
          const pval = `<span class="value">${this.$thousands(value)}</span>${this.$isNumber(value) ? '条' : ''}`;
          const dval = `<span class="value">${this.$thousands(data.department_num)}</span>${this.$isNumber(value) ? '家' : ''}`;
          return (
            `<div class="title">${params.name}</div>` +
            `<div class="d-flex ai-center item">` +
            `<div>政策数量：</div>` +
            `<div>${pval}</div>` +
            `</div>` +
            `<div class="d-flex ai-center item">` +
            `<div>政策发布单位数量：</div>` +
            `<div>${dval}</div>` +
            `</div>` +
            `</div>`
          );
        }
      }
    };
  },

  computed: {
    ...mapGetters(['iep_orgRegion', 'iep_platform_USER_INFO'])
  },

  created() {
    // console.log('PolicyQuery created');
    this.getPolicyAmount();
  },

  mounted() {},

  methods: {
    getDefaultRegion() {
      let cacheRegion = JSON.parse(localStorage.getItem('curPolicyRegion' + this.iep_platform_USER_INFO.username) || '[]');
      let path = [];
      if (Array.isArray(cacheRegion) && cacheRegion.length > 0) {
        path = cacheRegion;
      } else {
        const { regionPath, regionLevel } = this.iep_orgRegion;
        path = this.iep_orgRegion.regionPath.filter((n, i) => i < (regionLevel === 3 && regionPath.length === 3 ? 2 : 3));
      }
      return path;
    },
    regionTreeLoaded(tree) {
      this.regionTree = tree;
      this.$nextTick(() => {
        this.curRegion = this.getDefaultRegion();
        this.getTableData();
      });
    },
    changeMapLevel({ code }) {
      this.getPolicyAmount(code);
    },
    handleDetail(n) {
      this.storeScrollMemory();
      this.$router.push(`/policy-detail/${n.id || 1}`);
    },
    confirmRegion(val) {
      this.getTableData();
      localStorage.setItem('curPolicyRegion' + this.iep_platform_USER_INFO.username, JSON.stringify(this.curRegion));
    },
    handleConfirmCondition(data) {
      this.form = data;
      this.goList(this.form);
    },
    viewMore() {
      const { curRegion } = this;
      this.goList({
        regionPath: this.$refs.EeCascader.inputValue ? curRegion : [],
        regionCode: this.$refs.EeCascader.inputValue && curRegion.length > 0 ? curRegion[curRegion.length - 1] : '',
        regionCodeName: this.$refs.EeCascader.inputValue
      });
    },
    goList(val) {
      this.$router.push({
        name: 'PolicyList',
        params: JSON.parse(
          JSON.stringify({
            ...val,
            force: true
          })
        )
      });
    },
    getTableData() {
      const { curRegion } = this;
      const params = {
        province_code: curRegion[1] || '',
        city_code: curRegion[2] || ''
      };
      this.loading = true;
      api
        .getLatestPolicy(params)
        .then(({ data }) => {
          if (data.code === 0) {
            this.tableData = Object.assign(defaultData(), data.data);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getPolicyAmount(code = 'china') {
      api
        .getPolicyAmount({
          area_code: code === 'china' ? 86 : code
        })
        .then(({ data }) => {
          if (data.code === 0) {
            const values = data.data.map((n) => n.total_num);
            this.mapData.code = code;
            this.mapData.min = values.length == 1 ? 0 : Math.min(...values);
            this.mapData.max = Math.max(...values);
            this.mapData.data = data.data.map((n) => ({
              name: n.city_name || n.province_name,
              value: n.total_num,
              department_num: n.department_num
            }));
          }
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang='less'>
.page-policy-query {
  position: relative;
  .wrap {
    &-inner {
      padding: 24px;
    }
    &-chart {
      position: relative;
      height: 879px;
      .chart-title {
        position: absolute;
        top: 28px;
        left: 30px;
        padding: 0;
        font-size: 22px;
        font-weight: 600;
        line-height: 24px;
        z-index: 1;
      }
    }
    &-list {
      margin-top: 16px;
      padding: 12px 24px 24px;
      &__top {
        padding-bottom: 12px;
        border-bottom: 1px solid #e5e6eb;
        .title {
          color: #1d2129;
          font-size: 22px;
          font-weight: 600;
          line-height: 24px;
        }
        .ee-ilabel {
          margin-left: 158px;
        }
      }
      &__body {
        padding: 20px 0 0;
      }
      &__col {
        position: relative;
        min-height: 500px;
        &.none-new {
          .icon-new {
            display: none !important;
          }
        }
      }
      .col-title {
        padding-bottom: 14px;
        span {
          margin-left: 9px;
          font-size: 18px;
          font-weight: 500;
          line-height: 28px;
        }
      }
      &__item {
        position: relative;
        padding: 14px 0;
        border-radius: 4px;
        background: #fff;
        border-bottom: 1px dashed #e5e6eb;
        cursor: pointer;
        &:hover {
          // border-bottom-color: transparent;
          background: rgba(53, 109, 246, 0.08);
        }
        &:last-child {
          border-bottom-color: transparent !important;
        }
        .area {
          color: #356df6;
        }
        .date {
          margin-left: 13px;
          color: #86909c;
          font-size: 16px;
          font-family: D-DIN;
        }
        .icon-new {
          margin-left: 12px;
          width: 26px;
          height: 16px;
          line-height: 16px;
          border-radius: 2px;
          background: #cc4f47;
          font-size: 12px;
          font-family: D-DIN-Bold;
          font-weight: 700;
          color: #fff;
          div {
            margin: 0 auto;
            transform: scale(0.6);
            letter-spacing: 1px;
          }
        }
        .el-icon-arrow-right {
          margin-left: 10px;
          color: rgba(0, 0, 0, 0.25);
        }
      }
    }
    &-chart,
    &-list {
      border-radius: 4px;
      background: #fff;
      box-shadow: 0px 0px 16px 0px rgba(20, 38, 82, 0.07);
    }
  }
}
.policy-map-tooltip {
  display: none;
  padding: 13px 16px !important;
  min-width: 234px;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0px 0px 14px 0px rgba(19, 38, 82, 0.08) !important;
  border: none !important;
  line-height: 24px;
  div {
    color: #1a262c;
  }
  .title {
    padding-bottom: 5px;
    color: #000;
    font-weight: 500;
  }
  .value {
    color: #356df6;
    font-family: D-DIN;
  }
}
</style>
