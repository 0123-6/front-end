<script>
import { defineComponent } from 'vue';
import { financingCapacityApis } from '@/api/corporate-portrait';
import mixinOpenWindow from '@/utils/mixinOpenWindow';

export default defineComponent({
  name: 'FinancingCapacity',
  mixins: [mixinOpenWindow],
  props: {
    companyId: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      ListingDateTableCurrentPage: 1,
      ListingDateTablePageSize: 10,
      ListingDateTableTotal: 0,
      ListingDateTableData: [],
      ListingDateLoading: false,
      FinancingHistoryTableCurrentPage: 1,
      FinancingHistoryTablePageSize: 10,
      FinancingHistoryTableTotal: 0,
      FinancingHistoryTableData: [],
      FinancingHistoryLoading: false,
      showAll: [] // 存储展开/折叠状态及显示的数量
    };
  },
  computed: {
    displayItems() {
      return (draftNameResps, index) => {
        if (this.showAll[index]) {
          return draftNameResps;
        }
        return draftNameResps.slice(0, 2);
      };
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 每页选择
    changeSize(val, type) {
      this[type + 'TablePageSize'] = val;
      this[type + 'TableCurrentPage'] = 1;
      this.getTableData(type);
    },
    // 分页
    changePage(val, type) {
      this[type + 'TableCurrentPage'] = val;
      this.getTableData(type);
    },
    init() {
      ['ListingDate', 'FinancingHistory'].forEach((n) => {
        this.getTableData(n);
      });
    },
    getTableData(dataProp, order, column) {
      const apiName = `get${dataProp}TableData`;
      this[dataProp + 'Loading'] = true;
      financingCapacityApis[apiName]({
        companyId: this.companyId,
        pageNum: this[dataProp + 'TableCurrentPage'],
        pageSize: this[dataProp + 'TablePageSize'],
        order,
        column
      })
        .then(({ code, data }) => {
          if (code === '00000') {
            this[dataProp + 'TableData'] = (data.list || []).map((n, i) => {
              n.$index = this.$getRowIndex(i, this[dataProp + 'TableCurrentPage'], this[dataProp + 'TablePageSize']);
              return n;
            });
            this[dataProp + 'TableTotal'] = data.total;
          }
          this[dataProp + 'Loading'] = false;
        })
        .catch((e) => {
          console.log(e);
          this[dataProp + 'Loading'] = false;
        });
    },
    toggleDisplay(index) {
      this.$set(this.showAll, index, !this.showAll[index]);
    }
  }
});
</script>

<template>
  <div class="container">
    <div class="title">上市信息</div>
    <div v-loading="ListingDateLoading" class="listing-date">
      <el-table :data="ListingDateTableData" stripe style="width: 100%">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="listDate" label="时间">
          <template slot-scope="scope">
            <span>{{ scope.row.listDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totmktcap" label="市值（万元）">
          <template slot-scope="scope">
            <span>{{ scope.row.totmktcap || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pe" label="PE">
          <template slot-scope="scope">
            <span>{{ scope.row.pe || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pb" label="PB">
          <template slot-scope="scope">
            <span>{{ scope.row.pb || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="ListingDateTableTotal > ListingDateTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'ListingDate')"
        @current-change="changePage($event, 'ListingDate')"
        :current-page="ListingDateTableCurrentPage"
        :page-size="ListingDateTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="ListingDateTableTotal">
      </el-pagination>
    </div>
    <div class="title">融资历程</div>
    <div v-loading="FinancingHistoryLoading" class="financing-history">
      <el-table :data="FinancingHistoryTableData" stripe style="width: 100%">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="investingDate" label="日期" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.investingDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.productName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="investingRound" label="融资轮次" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.investingRound || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="investingAmount" label="融资金额" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.investingAmount || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="investFullName" label="投资机构" show-overflow-tooltip>
          <template slot-scope="scope">
            <!--            <div v-if="scope.row.investFullNames.length > 0">-->
            <!--              <div v-for="item of scope.row.investFullNames" :key="item.value">-->
            <!--                <span v-if="item.clicked"-->
            <!--                style="color: #0d7cdb; cursor: pointer"-->
            <!--                @click="toCorporatePortrait(item.value)">{{item.label}}</span>-->
            <!--                <span  v-if="!item.clicked">{{item.label}}</span>-->
            <!--              </div>-->
            <!--            </div>-->
            <!--            <div v-else>-</div>-->

            <div v-if="scope.row.investFullNames && scope.row.investFullNames.length > 0">
              <div v-for="item of displayItems(scope.row.investFullNames, scope.$index)" :key="item.value">
                <el-button v-if="item.clicked" class="ee-button--grid ell" type="text" @click="toCorporatePortrait(item.value)">
                  {{ item.label }}
                </el-button>
                <span v-else>{{ item.label }}</span>
              </div>
              <div v-if="scope.row.investFullNames.length > 2" style="cursor: pointer; color: #0d7cdb" @click="toggleDisplay(scope.$index)">
                <span v-if="showAll[scope.$index]">收起</span>
                <span v-else>展开全部</span>
              </div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="FinancingHistoryTableTotal > FinancingHistoryTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'FinancingHistory')"
        @current-change="changePage($event, 'FinancingHistory')"
        :current-page="FinancingHistoryTableCurrentPage"
        :page-size="FinancingHistoryTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="FinancingHistoryTableTotal">
      </el-pagination>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  height: 100%;
  padding: 20px 24px;
  .title {
    color: rgba(0, 0, 0, 0.85);
    font-family: PingFang SC;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
  }
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
  .listing-date,
  .financing-history {
    padding-bottom: 32px;
    .el-table {
      margin-top: 20px;
    }
  }
  ::v-deep .el-table .cell {
    height: auto;
  }
}
</style>
