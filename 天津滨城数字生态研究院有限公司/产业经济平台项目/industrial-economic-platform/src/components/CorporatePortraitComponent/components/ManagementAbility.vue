<script>
import { defineComponent } from 'vue';
import { managementAbilityApis } from '@/api/corporate-portrait';
import mixinOpenWindow from '@/utils/mixinOpenWindow';

export default defineComponent({
  name: 'ManagementAbility',
  mixins: [mixinOpenWindow],
  props: {
    companyId: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      CorporateReportTableCurrentPage: 1,
      CorporateReportTablePageSize: 10,
      CorporateReportTableTotal: 0,
      CorporateReportTableData: [],
      CorporateReportLoading: false,
      TenderTableCurrentPage: 1,
      TenderTablePageSize: 10,
      TenderTableTotal: 0,
      TenderTableData: [],
      TenderLoading: false,
      AdministrativeLicenseTableCurrentPage: 1,
      AdministrativeLicenseTablePageSize: 10,
      AdministrativeLicenseTableTotal: 0,
      AdministrativeLicenseTableData: [],
      AdministrativeLicenseLoading: false,
      LandInformationTableCurrentPage: 1,
      LandInformationTablePageSize: 10,
      LandInformationTableTotal: 0,
      LandInformationTableData: [],
      LandInformationLoading: false
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
      ['CorporateReport', 'Tender', 'AdministrativeLicense', 'LandInformation'].forEach((n) => {
        this.getTableData(n);
      });
    },
    getTableData(dataProp, order, column) {
      const apiName = `get${dataProp}TableData`;
      this[dataProp + 'Loading'] = true;
      managementAbilityApis[apiName]({
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
    sortChange(column, type) {
      if (!column.order) {
        return;
      }
      this[type + 'TableCurrentPage'] = 1;
      this.getTableData(type, column.order, column.prop);
    },
    // 查看年报
    viewReportYear(row) {
      this.$router.push(`/corporate-portrait/year-report/${row.annualReportId}/${row.annualReportYear}`);
    }
  }
});
</script>

<template>
  <div class="container">
    <div class="title">企业年报</div>
    <div v-loading="CorporateReportLoading" class="corporate-report">
      <el-table :data="CorporateReportTableData" stripe style="width: 100%">
        <el-table-column label="序号" prop="$index" width="280" />
        <el-table-column prop="annualReportYear" label="年报">
          <template slot-scope="scope">
            <el-button class="ee-button--grid ell" type="text" @click="viewReportYear(scope.row)">{{
              scope.row.annualReportYear + '年度报告'
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="CorporateReportTableTotal > 10"
        class="pagination"
        @size-change="changeSize($event, 'CorporateReport')"
        @current-change="changePage($event, 'CorporateReport')"
        :current-page="CorporateReportTableCurrentPage"
        :page-size="CorporateReportTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="CorporateReportTableTotal">
      </el-pagination>
    </div>
    <div class="title">招投标</div>
    <div v-loading="TenderLoading" class="Tender">
      <el-table :data="TenderTableData" stripe style="width: 100%">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.projectName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="noticeDate" label="发布日期" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.noticeDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="companyRoleName" label="企业角色" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.companyRoleName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="regionName" label="省份地区" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.regionName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="theTender" label="招采单位" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="item of scope.row.Tenders" :key="item.theTenderId">
              <el-button v-if="item.TenderClicked" class="ee-button--grid ell" type="text" @click="toCorporatePortrait(item.theTenderId)">
                {{ item.theTenderName }}
              </el-button>
              <span v-else>{{ item.theTenderName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="winnings" label="中标单位" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="item of scope.row.winnings" :key="item.theWinningId">
              <el-button v-if="item.winningClicked" class="ee-button--grid ell" type="text" @click="toCorporatePortrait(item.theWinningId)">
                {{ item.theWinningName }}
              </el-button>
              <span v-else>{{ item.theWinningName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="winningAmount" label="中标金额（万人民币）" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.winningAmount || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="TenderTableTotal > 10"
        class="pagination"
        @size-change="changeSize($event, 'Tender')"
        @current-change="changePage($event, 'Tender')"
        :current-page="TenderTableCurrentPage"
        :page-size="TenderTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="TenderTableTotal">
      </el-pagination>
    </div>
    <div class="title">行政许可</div>
    <div v-loading="AdministrativeLicenseLoading" class="administrative-license">
      <el-table :data="AdministrativeLicenseTableData" stripe style="width: 100%" @sort-change="sortChange($event, 'AdministrativeLicense')">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="wno" label="决定文书/许可编号" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.wno || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="wname" label="决定文书/许可证名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.wname || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="valform" label="有效期自" width="120" show-overflow-tooltip sortable="custom">
          <template slot-scope="scope">
            <span>{{ scope.row.valform }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="valform" label="有效期至" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.valto }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="licanth" label="许可机关" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button v-if="scope.row.clicked" class="ee-button--grid ell" type="text" @click="toCorporatePortrait(scope.row.licanthId)">
              {{ scope.row.licanth || '-' }}
            </el-button>
            <span v-else>{{ scope.row.licanth || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="liccontent" label="许可内容" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.liccontent || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="beforeContent" label="来源" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.beforeContent || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="AdministrativeLicenseTableTotal > AdministrativeLicenseTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'AdministrativeLicense')"
        @current-change="changePage($event, 'AdministrativeLicense')"
        :current-page="AdministrativeLicenseTableCurrentPage"
        :page-size="AdministrativeLicenseTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="AdministrativeLicenseTableTotal">
      </el-pagination>
    </div>
    <div class="title">土地信息</div>
    <div v-loading="LandInformationLoading" class="land-information">
      <el-table :data="LandInformationTableData" stripe style="width: 100%" @sort-change="sortChange($event, 'LandInformation')">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="address" label="土地位置" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.address || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="darea" label="面积（平方米）" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.darea || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dprice" label="成交价格（万人民币）" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.dprice || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="duse" label="土地用途" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.duse || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="authorg" label="发布/批准单位" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button v-if="scope.row.clicked" class="ee-button--grid ell" type="text" @click="toCorporatePortrait(scope.row.authorgId)">
              {{ scope.row.authorg || '-' }}
            </el-button>
            <span v-else>{{ scope.row.authorg || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tdate" sortable="custom" label="发布/签订日期" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.tdate || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="LandInformationTableTotal > LandInformationTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'LandInformation')"
        @current-change="changePage($event, 'LandInformation')"
        :current-page="LandInformationTableCurrentPage"
        :page-size="LandInformationTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="LandInformationTableTotal">
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
  .corporate-report,
  .Tender,
  .administrative-license,
  .land-information {
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
