<template>
  <div v-loading="dataLoading" class="company-list-chain">
    <div class="caret-row"><i class="el-icon-caret-top"></i></div>
    <div class="title d-flex ai-center jc-between">
      <div class="d-flex ai-center">
        <template v-if="showType == 2">
          <span class="back" @click="showType = 1"><i class="el-icon-arrow-left"></i>返回</span>
          <span class="split"></span>
        </template>
        <span class="title-text">{{ showType === 1 ? '产业链' : typeName }}</span>
      </div>
      <i class="el-icon-close" @click="$emit('close')"></i>
    </div>
    <div v-show="showType == 1" class="chain-list d-flex ai-center flex-wrap">
      <div
        class="item ell flex-center ai-center"
        :class="{ 'is-active': type == n.id, 'is-disabled': n.authorized === false }"
        v-for="n in chainList"
        :key="n.id"
        @click="chooseType(n)">
        {{ n.name }}
      </div>
    </div>
    <BaseTreeG6
      v-if="initTree"
      v-show="showType == 2"
      ref="baseTree"
      :chartData="treeData"
      :height="410"
      :padding-y="40"
      multiple
      @change="changeTreeNodes"></BaseTreeG6>
    <div class="d-flex ai-start c-tag-list">
      <span>已选条件：</span>
      <div class="d-flex ai-center flex-wrap flex-1">
        <div v-if="type" class="d-flex ai-center c-tag-item">
          产业链：
          <span class="value flex-1">{{ typeName }}</span>
          <i class="el-icon-close" @click="handleClear"></i>
        </div>
        <div v-if="selectedNodes.length > 0" class="d-flex ai-center c-tag-item">
          节点：
          <span class="value flex-1">{{ selectedNodes.map((n) => n.name).join('、') }}</span>
          <i class="el-icon-close" @click="clearNodes"></i>
        </div>
      </div>
      <el-button class="ee-button" size="small" type="primary" :disabled="loading" @click="handleConfirm">确 定</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex';
import mixinChain from '@/utils/mixinChain';
import { chainApis } from '@/api/industry-map';
import BaseTreeG6 from '@/components/BaseTreeG6/index.vue';
import { industryChain } from '@/api/industryChain';

export default {
  components: {
    BaseTreeG6
  },
  mixins: [mixinChain],
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataLoading: false,
      initTree: false,
      showType: 1,
      type: '',
      typeName: '',
      selectedNodes: [],
      treeData: {
        datas: []
      }
    };
  },

  computed: {
    ...mapGetters(['iep_platform_SEARCH_INFO', 'iep_platform_MENU_ID'])
  },

  created() {},

  mounted() {},

  methods: {
    handleClear() {
      this.showType = 1;
      this.type = '';
      this.typeName = '';
      this.chainCode = '';
      this.clearNodes();
    },
    clearNodes() {
      if (this.$refs.baseTree) this.$refs.baseTree.removeChecked(this.selectedNodes.map((n) => n.id));
      this.selectedNodes = [];
    },
    handleConfirm() {
      this.$emit('change', {
        type: this.type,
        typeName: this.typeName,
        chainCode: this.chainCode,
        selectedNodes: [].concat(this.selectedNodes)
      });
      this.$emit('close');
    },
    changeTreeNodes(val) {
      this.selectedNodes = val;
    },
    getChainDataById() {
      // this.treeData = {
      //   datas: industryChain
      // };
      const params = {
        id: this.type,
        regionCode: 'china'
      };
      this.dataLoading = true;
      chainApis
        .getChainById(params)
        .then((res) => {
          this.treeData = {
            datas: res.data
          };
          this.dataLoading = false;
        })
        .catch(() => {
          this.dataLoading = false;
        });
    },
    chooseType(item) {
      if (item.authorized === false) return;
      const { id, name, chainCode } = item;
      this.showType = 2;
      if (this.type !== id) {
        this.type = id;
        this.typeName = name;
        this.chainCode = chainCode;
        this.initTree = true;
        this.selectedNodes = [];
        this.$nextTick(() => {
          this.getChainDataById();
        });
      }
    }
  }
};
</script>
<style lang='less'>
.company-list-chain {
  position: relative;
  margin-top: -46px;
  border-radius: 2px;
  background: #fff;
  box-shadow: 0px 0px 14px 0px rgba(19, 38, 82, 0.08);
  z-index: 101;
  .gSix-tree {
    position: relative;
  }
  .title {
    padding: 24px 15px 22px 24px;
    color: #356df6;
    font-size: 14px;
    font-weight: 400;
    .back {
      cursor: pointer;
    }
    .el-icon-arrow-left {
      margin-right: 2px;
      color: rgba(0, 0, 0, 0.25);
    }
    .split {
      margin: 0 18px;
      width: 1px;
      height: 12px;
      background: #dcdfe6;
    }
    &-text {
      color: #1d2129;
      font-size: 18px;
      font-weight: 500;
      line-height: 24px;
    }
    .el-icon-close {
      padding: 5px;
      color: #356df6;
      font-size: 18px;
      cursor: pointer;
    }
  }
  .chain-list {
    padding: 0 14px 28px 18px;
    .item {
      padding: 0 3px;
      margin: 10px 6px 4px;
      width: 97px;
      height: 37px;
      box-sizing: border-box;
      border-radius: 2px;
      background: #f3f3f3;
      color: #555;
      cursor: pointer;
      &.is-active,
      &:hover {
        background: rgba(53, 109, 246, 0.1);
        color: #356df6;
      }
      &.is-disabled {
        background: #fff;
        color: #909399;
        cursor: not-allowed;
      }
    }
  }
  .caret-row {
    width: 1060px;
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
  }
  .el-icon-caret-top {
    position: absolute;
    top: 0;
    right: 201px;
    color: #fff;
    font-size: 30px;
  }
  div.c-tag {
    &-list {
      padding: 19px 24px 21px 24px;
    }
  }
}
</style>
