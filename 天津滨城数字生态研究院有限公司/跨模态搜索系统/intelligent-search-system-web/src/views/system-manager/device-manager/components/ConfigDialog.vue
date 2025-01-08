<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-11 17:41:30
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-21 14:45:30
 * @FilePath: \company-template\src\views\system-manager\components\MessageDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    v-dialogDrag
    :title="state === 'create'?'配置':'取消配置'"
    visible
    width="900px"
    :close-on-click-modal="false"
    :custom-class="'config-dialog'"
    :before-close="cancelOperation"
  >
    <div class="dialog-main" v-loading="loading">
      <el-row :gutter="16">
        <el-col class="operation-container">
          <TableOperationSearchInput :searchWord.sync="searchWord" @search="searchTable" placeholder="请输入模型名称"/>
          <div class="select-tip">已选择<span class="label-color">{{selectedItemList.length}}</span>个</div>
        </el-col>
        <el-col v-for="item of cardList" :key="item.id" :span="8" class="card-container">
          <el-card shadow="hover" :class="{'active': selectedItemList.indexOf(item.id) >= 0}">
            <div class="card-title">{{item.id}} - {{item.modelNameCh}}</div>
            <div class="card-description">
              <el-tooltip effect="dark"
                          :content="item.modelShortDescribe"
                          :disabled="item.modelShortDescribe.length <= 76"
                          placement="top">
                <span class="card-detail text-black">{{item.modelShortDescribe}}</span>
              </el-tooltip>
            </div>
            <div class="card-operation"><el-checkbox @change="changeSelectedCard(item.id)"></el-checkbox></div>
          </el-card>
        </el-col>
        <EmptyState v-if="cardList && cardList.length === 0"></EmptyState>
        <el-col>
          <el-pagination
            v-if="tableTotal !== 0"
            background
            layout="total, prev, pager, next, jumper"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :total="tableTotal"
            @current-change="changePage">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button class="cancel" @click="cancelOperation">取消</el-button>
      <el-button class="primary" :disabled="selectedItemList.length === 0" @click="saveOperation">确认</el-button>
    </span>
  </el-dialog>
</template>
<script>
import _debounce from 'lodash/debounce.js';
import TableOperationSearchInput from '@/views/system-manager/components/TableOperationSearchInput';
import { getModelListData } from '@/api/device-manage';
import EmptyState from '@/components/EmptyState';

export default {
  props: {
    state: {
      type: String,
      default: 'create',
      required: true
    },
    detail: {
      type: Object,
      required: true
    }
  },
  components: {
    TableOperationSearchInput,
    EmptyState
  },
  data() {
    return {
      searchWord: '',
      cardList: null,
      selectedItemList: [],
      currentPage: 1,
      pageSize: 6,
      tableTotal: 0,
      loading: false
    };
  },
  mounted() {
    this.getCardList();
  },
  methods: {
    changePage(val) {
      this.currentPage = val;
      this.getCardList();
    },
    // 搜索
    searchTable() {
      this.changePage(1);
    },
    getCardList() {
      this.loading = true;
      const params = {
        config: '',
        deviceId: this.detail.id,
        keyword: this.searchWord,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      if (this.state === 'create') {
        params.config = 'UN_CONFIGURED';
      } else {
        params.config = 'CONFIGURED';
      }
      getModelListData(params).then((res) => {
        this.cardList = res.data.records;
        this.tableTotal = res.data.total;
        this.loading = false;
      });
    },
    changeSelectedCard(value) {
      const index = this.selectedItemList.indexOf(value);
      if (index >= 0) {
        this.selectedItemList.splice(index, 1);
      } else {
        this.selectedItemList.unshift(value);
      }
    },
    // 取消按钮
    cancelOperation() {
      this.$emit('cancel');
    },
    // 确定按钮
    saveOperation: _debounce(function () {
      this.$emit('save', this.selectedItemList);
    }, 300)
  }
};
</script>
<style lang="less" scoped>
@import '~@/styles/variables.less';
.config-dialog {
  .dialog-main {
    min-height: 300px;
    .operation-container {
      height: 40px;
      line-height: 40px;
      margin: 12px 0;
      .select-tip {
        float: right;
      }
    }
    ::v-deep .el-loading-spinner{
      &:extend(.flex-center);
    }
    .card-container {
      padding-top: 8px;
      padding-bottom: 8px;
      .active {
        background: rgba(12,97,170,0.05);
        border: 1px solid @primary-color;
        box-shadow: 0 0 7px 0 rgba(133,166,189,0.46);
      }
      .card-title {
        font-size: 14px;
        color: @text-primary-dark;
        font-weight: 600;
        margin-bottom: 8px;
        .line-text-overflow()
      }
      .card-description {
        font-size: 12px;
        height: 100px;
        .card-detail {
          .ellipsis-muti-line(4);
        }
      }
      .card-operation {
        text-align: right;
      }
    }
    .el-pagination {
      text-align: center;
      padding: 12px 0;
    }
  }
}
</style>
