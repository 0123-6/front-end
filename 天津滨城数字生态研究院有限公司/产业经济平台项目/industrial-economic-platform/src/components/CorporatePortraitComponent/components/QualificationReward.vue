<script>
import { defineComponent } from 'vue';
import { qualificationRewardApis } from '@/api/corporate-portrait';

export default defineComponent({
  name: 'QualificationReward',
  props: {
    companyId: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      QualificationRecognitionTableCurrentPage: 1,
      QualificationRecognitionTablePageSize: 10,
      QualificationRecognitionTableTotal: 0,
      QualificationRecognitionTableData: [],
      QualificationRecognitionLoading: false,
      FilingPermitTableCurrentPage: 1,
      FilingPermitTablePageSize: 10,
      FilingPermitTableTotal: 0,
      FilingPermitTableData: [],
      FilingPermitLoading: false
    };
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
      ['QualificationRecognition', 'FilingPermit'].forEach((n) => {
        this.getTableData(n);
      });
    },
    getTableData(dataProp, order, column) {
      const apiName = `get${dataProp}TableData`;
      this[dataProp + 'Loading'] = true;
      qualificationRewardApis[apiName]({
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
    }
  }
});
</script>

<template>
  <div class="container">
    <div class="title">资质认定</div>
    <div v-loading="QualificationRecognitionLoading" class="qualification-recognition">
      <el-table :data="QualificationRecognitionTableData" stripe style="width: 100%">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="initialAwardDate" label="发证日期" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.initialAwardDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cccType" label="证书类型" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.cccType || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cccItem" label="产品名称及单元（主）" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.cccItem || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="certNo" label="证书编号" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.certNo || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invalidDate" label="截止日期" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.invalidDate || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="QualificationRecognitionTableTotal > QualificationRecognitionTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'QualificationRecognition')"
        @current-change="changePage($event, 'QualificationRecognition')"
        :current-page="QualificationRecognitionTableCurrentPage"
        :page-size="QualificationRecognitionTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="QualificationRecognitionTableTotal">
      </el-pagination>
    </div>
    <div class="title">备案许可</div>
    <div v-loading="FilingPermitLoading" class="filing-permit">
      <el-table :data="FilingPermitTableData" stripe style="width: 100%">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="webName" label="网站名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.webName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="webUrl" label="网址" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link
              v-if="scope.row.webUrl"
              class="ee-link"
              :href="scope.row.webUrl?.indexOf('//') > -1 ? scope.row.webUrl : '//' + scope.row.webUrl"
              :underline="false"
              target="_blank">
              {{ scope.row.webUrl }}
            </el-link>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="webDomain" label="域名" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.webDomain || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="webNo" label="网址备案/许可证号" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.webNo || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="shDate" label="审核日期" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.shDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="icpNum" label="公安备案" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.icpNum || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="FilingPermitTableTotal > FilingPermitTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'FilingPermit')"
        @current-change="changePage($event, 'FilingPermit')"
        :current-page="FilingPermitTableCurrentPage"
        :page-size="FilingPermitTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="FilingPermitTableTotal">
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
  .qualification-recognition,
  .filing-permit {
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
