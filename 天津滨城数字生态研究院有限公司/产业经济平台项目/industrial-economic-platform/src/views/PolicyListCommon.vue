<template>
  <div class="page-policy-common">
    <div class="list-content">
      <div class="list-item" v-for="n in tableData" :key="n.id" @click="handleDetail(n)">
        <div class="d-flex ai-center list-item__top">
          <div class="ee-tag--rect" :style="{ background: policyCategories.find((c) => n.category === c.text).color }">{{ n.category }}</div>
          <div class="name flex-1 ell" :title="n.title">{{ n.title }}</div>
          <!-- <div class="ee-tag--dot is-success">{{ n.statusName }}</div> -->
          <el-button class="ee-button--back" type="text">详情<i class="el-icon-arrow-right"></i></el-button>
        </div>
        <div class="d-flex ai-center flex-wrap list-item__bottom">
          <span class="ee-ilabel">发布机构：</span>
          <span class="ee-ivalue">{{ n.publish_department }}</span>
          <span class="ee-ilabel">地区：</span>
          <span class="ee-ivalue">{{ n.province_name || '' }}{{ n.city_name || '' }}{{ n.park_name || '' }}</span>
          <span class="ee-ilabel">发布时间：</span>
          <span class="ee-ivalue f-d-din">{{ n.publish_date }}</span>
        </div>
      </div>
      <div v-show="tableData.length == 0" class="ee-nodata">暂无数据</div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { policyCategories } from '@/utils/constant';

export default {
  name: 'PolicyListCommon',
  components: {},
  props: {
    mode: {
      type: String,
      default: ''
    },
    showForm: {
      type: Boolean,
      default: true
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    params: {
      type: Object,
      default() {
        return {};
      }
    },
    placeholder: {
      type: String,
      default: '请输入关键词'
    },
    tableData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      policyCategories
    };
  },
  methods: {
    handleDetail(n) {
      this.$emit('detail');
      this.$router.push(`/policy-detail/${n.id}`);
    }
  }
};
</script>
<style lang='less'>
.page-policy-common {
  .list {
    &-item {
      margin-bottom: 16px;
      padding-left: 24px;
      border-radius: 4px;
      background: #fff;
      box-shadow: 0px 0px 16px 0px rgba(20, 38, 82, 0.07);
      &:hover {
        background: rgba(53, 109, 246, 0.1);
      }
      &__top {
        position: relative;
        padding: 14px 114px 10px 0;
        border-bottom: 1px dashed #e5e6eb;
      }
      .type {
        border-radius: 2px;
      }
      .name {
        margin-left: 11px;
        font-size: 18px;
        line-height: 25px;
        font-weight: 500;
        cursor: pointer;
      }
      .ee-tag--dot {
        margin-left: 21px;
      }
      .ee-tag--rect {
        font-size: 13px;
        padding: 2px 8px;
      }
      .el-button {
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
      }
      &__bottom {
        padding: 14px 0;
      }
    }
  }
}
</style>
