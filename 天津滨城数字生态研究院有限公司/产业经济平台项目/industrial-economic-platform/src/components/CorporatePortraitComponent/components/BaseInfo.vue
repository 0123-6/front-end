<script>
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import { baseInfoApis } from '@/api/corporate-portrait';
import mixinOpenWindow from '@/utils/mixinOpenWindow';

export default defineComponent({
  name: 'BaseInfo',
  mixins: [mixinOpenWindow],
  props: {
    companyId: {
      type: String
    }
  },
  data() {
    return {
      industrialCommercial: {},
      stockholderTablePageSize: 10,
      stockholderTableCurrentPage: 1,
      stockholderTableTotal: 0,
      stockholderTableData: [],
      stockholderLoading: false,
      mainPersonalTablePageSize: 10,
      mainPersonalTableCurrentPage: 1,
      mainPersonalTableTotal: 0,
      mainPersonalTableData: [],
      mainPersonalLoading: false,
      investmentTablePageSize: 10,
      investmentTableCurrentPage: 1,
      investmentTableTotal: 0,
      investmentTableData: [],
      investmentLoading: false,
      branchOfficeTablePageSize: 10,
      branchOfficeTableCurrentPage: 1,
      branchOfficeTableTotal: 0,
      branchOfficeTableData: [],
      branchOfficeLoading: false,
      changeLogTablePageSize: 10,
      changeLogTableCurrentPage: 1,
      changeLogTableTotal: 0,
      changeLogTableData: [],
      changeLogLoading: false,
      companyStatusMap: {},
      companyTypeMap: {}
    };
  },
  computed: {
    ...mapGetters([])
  },
  created() {
    this.handleColor(JSON.parse(localStorage.getItem('iep_platform_all_dict')));
  },
  mounted() {
    this.init();
  },
  methods: {
    handleColor(data) {
      this.companyStatusMap = new Map(data?.company_status.map((item) => [item.itemCode, item]));
      this.companyTypeMap = new Map(data?.company_type.map((item) => [item.itemCode, item]));
    },
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
      this.getIndustrialCommercial();
      ['stockholder', 'mainPersonal', 'investment', 'branchOffice', 'changeLog'].forEach((n) => {
        this.getTableData(n);
      });
    },
    getIndustrialCommercial() {
      baseInfoApis.getIndustrialCommercialData({ companyId: this.companyId }).then((res) => {
        if (res.code === '00000') {
          this.industrialCommercial = res.data;
        }
      });
    },
    getTableData(dataProp, order, column) {
      const apiName = `get${dataProp.substr(0, 1).toUpperCase()}${dataProp.substr(1, dataProp.length - 1)}TableData`;
      this[dataProp + 'Loading'] = true;
      baseInfoApis[apiName]({
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
    }
  }
});
</script>

<template>
  <div class="container">
    <div class="title">工商信息</div>
    <div class="base-info">
      <table class="eee-table" style="width: 100%">
        <colgroup>
          <col width="15%" />
          <col width="35%" />
          <col width="15%" />
          <col width="35%" />
        </colgroup>
        <tbody>
          <tr>
            <td class="cell-label">统一社会信用代码</td>
            <td class="cell-value">
              <span v-if="industrialCommercial.creditNo" class="f-d-din">{{ industrialCommercial.creditNo }}</span>
              <span v-else>-</span>
            </td>
            <td class="cell-label">企业名称</td>
            <td class="cell-value">{{ industrialCommercial.companyName || '-' }}</td>
          </tr>
          <tr>
            <td class="cell-label">法定代表人</td>
            <td class="cell-value">{{ industrialCommercial.legalPersonName || '-' }}</td>
            <td class="cell-label">经营状态</td>
            <td class="cell-value">{{ companyStatusMap?.get(industrialCommercial.regStatus)?.itemName || '-' }}</td>
          </tr>
          <tr>
            <td class="cell-label">注册资本</td>
            <td class="cell-value">
              <template v-if="industrialCommercial.regCapital">
                <span class="f-d-din">{{ industrialCommercial.regCapital }}</span
                >万元
              </template>
              <span v-else>-</span>
            </td>
            <td class="cell-label">实缴资本</td>
            <td class="cell-value">
              <template v-if="industrialCommercial.contributedCapital">
                <span class="f-d-din">{{ industrialCommercial.contributedCapital }}</span
                >万元
              </template>
              <span v-else>-</span>
            </td>
          </tr>
          <tr>
            <td class="cell-label">组织机构代码</td>
            <td class="cell-value">{{ industrialCommercial.orgNo || '-' }}</td>
            <td class="cell-label">工商注册号</td>
            <td class="cell-value">
              <span v-if="industrialCommercial.regNo" class="f-d-din">{{ industrialCommercial.regNo }}</span>
              <span v-else>-</span>
            </td>
          </tr>
          <tr>
            <td class="cell-label">所属行业</td>
            <td class="cell-value">{{ industrialCommercial.industryName || '-' }}</td>
            <td class="cell-label">所属地区</td>
            <td class="cell-value">{{ industrialCommercial.regionName || '-' }}</td>
          </tr>
          <tr>
            <td class="cell-label">人员规模</td>
            <td class="cell-value">{{ industrialCommercial.personnelSize ? industrialCommercial.personnelSize + '人' : '-' }}</td>
            <td class="cell-label">参保人数</td>
            <td class="cell-value">{{ industrialCommercial.so110Count ? industrialCommercial.so110Count + '人' : '-' }}</td>
          </tr>
          <tr>
            <td class="cell-label">成立日期</td>
            <td class="cell-value">
              <span v-if="industrialCommercial.setupDate" class="f-d-din">{{ industrialCommercial.setupDate }}</span>
              <span v-else>-</span>
            </td>
            <td class="cell-label">经营期限</td>
            <td class="cell-value">
              <span v-if="industrialCommercial.operateDate" class="f-d-din">{{ industrialCommercial.operateDate }}</span>
              <span v-else>-</span>
            </td>
          </tr>
          <tr>
            <td class="cell-label">企业规模</td>
            <td class="cell-value">{{ industrialCommercial.enterpriseSize || '-' }}</td>
            <td class="cell-label">登记机关</td>
            <td class="cell-value">{{ industrialCommercial.regAuthority || '-' }}</td>
          </tr>
          <tr>
            <td class="cell-label">企业类型</td>
            <td class="cell-value">
              <span v-for="item of industrialCommercial.type" :key="item"> {{ companyTypeMap.get(item)?.itemName }}</span>
            </td>
            <td class="cell-label">曾用名</td>
            <td class="cell-value">{{ industrialCommercial.oldName || '-' }}</td>
          </tr>
          <tr>
            <td class="cell-label">注册地址</td>
            <td class="cell-value" colspan="3">{{ industrialCommercial.regAdminNo || '-' }}</td>
          </tr>
          <tr>
            <td class="cell-label">经营范围</td>
            <td class="cell-value" colspan="3">{{ industrialCommercial.businessScope || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="title">股东信息</div>
    <div v-loading="stockholderLoading" class="stockholder-info">
      <el-table :data="stockholderTableData" stripe style="width: 100%" @sort-change="sortChange($event, 'stockholder')">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="shareholderName" label="股东名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="StrCharAt">
              <span>{{ scope.row.shareholderName?.charAt(0) }}</span>
              <span v-if="!scope.row.clicked" class="flex-1 ell">{{ scope.row.shareholderName }}</span>
              <el-button v-else class="ee-button--grid ell flex-1 text-left" type="text" @click="toCorporatePortrait(scope.row.shareholderCompanyId)">
                {{ scope.row.shareholderName }}
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="shareholderRatio" label="持股比例（%）" width="150" sortable="custom">
          <template slot-scope="scope">
            <span>{{ scope.row.shareholderRatio || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sccAmount" label="认缴出资金额（万人民币）" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.sccAmount || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accDate" label="认缴出资日期" width="140"> </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="stockholderTableTotal > stockholderTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'stockholder')"
        @current-change="changePage($event, 'stockholder')"
        :current-page="stockholderTableCurrentPage"
        :page-size="stockholderTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="stockholderTableTotal">
      </el-pagination>
    </div>
    <div class="title">主要人员</div>
    <div v-loading="mainPersonalLoading" class="main-personnel">
      <el-table :data="mainPersonalTableData" stripe style="width: 100%">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="name" label="姓名">
          <template slot-scope="scope">
            <div class="smallStrCharAt">
              <span v-if="scope.row.name">{{ scope.row.name?.charAt(0) }}</span>
              <span class="flex-1 ell">{{ scope.row.name || '-' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="position" label="职位">
          <template slot-scope="scope">
            <span>{{ scope.row.position || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="shareholderRatio" label="持股比例（%）">
          <template slot-scope="scope">
            <span>{{ scope.row.shareholderRatio || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="mainPersonalTableTotal > mainPersonalTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'mainPersonal')"
        @current-change="changePage($event, 'mainPersonal')"
        :current-page="mainPersonalTableCurrentPage"
        :page-size="mainPersonalTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="mainPersonalTableTotal">
      </el-pagination>
    </div>
    <div class="title">对外投资</div>
    <div v-loading="investmentLoading" class="outward-investment">
      <el-table :data="investmentTableData" stripe style="width: 100%" @sort-change="sortChange($event, 'investment')">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="companyName" label="被投资企业名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="smallStrCharAt" @click="toCorporatePortrait(scope.row.investCompanyId)" style="cursor: pointer">
              <span>{{ (scope.row.companyName || scope.row.legalPersonName)?.charAt(0) }}</span>
              <span class="flex-1 ell" style="color: #356df6">{{ scope.row.companyName || scope.row.legalPersonName || '-' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="legalPersonName" label="法定代表人" width="130" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.clicked" class="smallStrCharAt" @click="toCorporatePortrait(scope.row.legalPersonId)" style="cursor: pointer">
              <span>{{ scope.row.legalPersonName?.charAt(0) }}</span>
              <span class="flex-1 ell" style="color: #356df6">{{ scope.row.legalPersonName || '-' }}</span>
            </div>
            <div v-else class="smallStrCharAt">
              <span>{{ scope.row.legalPersonName?.charAt(0) }}</span>
              <span class="flex-1 ell">{{ scope.row.legalPersonName || '-' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="regCapital" label="注册资本（万人民币）" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.regCapital || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="setupDate" label="成立日期" width="120" sortable="custom" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.setupDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="regStatus" label="经营状态" width="90" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ companyStatusMap?.get(scope.row.regStatus)?.itemName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="shareholderRatio" label="持股比例（%）" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.shareholderRatio || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="subconam" label="认缴出资金额（万人民币）" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.subconam || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="investmentTableTotal > investmentTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'investment')"
        @current-change="changePage($event, 'investment')"
        :current-page="investmentTableCurrentPage"
        :page-size="investmentTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="investmentTableTotal">
      </el-pagination>
    </div>
    <div class="title">分支机构</div>
    <div v-loading="branchOfficeLoading" class="branch-office">
      <el-table :data="branchOfficeTableData" stripe style="width: 100%">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="companyName" label="企业名称" min-width="300" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="smallStrCharAt" style="cursor: pointer" @click="toCorporatePortrait(scope.row.companyId)">
              <span>{{ scope.row.companyName?.charAt(0) }}</span>
              <span class="flex-1 ell" style="color: #356df6">{{ scope.row.companyName || '-' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="legalPersonName" label="负责人" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.clicked" class="smallStrCharAt" @click="toCorporatePortrait(scope.row.legalPersonId)" style="cursor: pointer">
              <span>{{ scope.row.legalPersonName?.charAt(0) }}</span>
              <span class="flex-1 ell" style="color: #356df6">{{ scope.row.legalPersonName || '-' }}</span>
            </div>
            <div v-else class="smallStrCharAt">
              <span>{{ scope.row.legalPersonName?.charAt(0) }}</span>
              <span class="flex-1 ell">{{ scope.row.legalPersonName || '-' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="setupDate" label="成立日期" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.setupDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="regStatus" label="经营状态" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ companyStatusMap.get(scope.row.regStatus)?.itemName || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="branchOfficeTableTotal > branchOfficeTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'branchOffice')"
        @current-change="changePage($event, 'branchOffice')"
        :current-page="branchOfficeTableCurrentPage"
        :page-size="branchOfficeTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="branchOfficeTableTotal">
      </el-pagination>
    </div>
    <div class="title">变更记录</div>
    <div v-loading="changeLogLoading" class="change-log">
      <el-table :data="changeLogTableData" stripe style="width: 100%" @sort-change="sortChange($event, 'changeLog')">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="changeDate" label="变更日期" width="120" sortable="custom" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.changeDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="changeItem" label="变更项目" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.changeItem || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="beforeContent" label="变更前" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.beforeContent || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="afterContent" label="变更后" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.afterContent || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="changeLogTableTotal > changeLogTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'changeLog')"
        @current-change="changePage($event, 'changeLog')"
        :current-page="changeLogTableCurrentPage"
        :page-size="changeLogTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="changeLogTableTotal">
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
  .StrCharAt {
    display: flex;
    align-items: center;
    > span:first-child {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      color: #fff;
      font-family: PingFang SC;
      font-size: 20px;
      font-weight: 400;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      background: #356df6;
      margin-right: 10px;
    }
  }
  .smallStrCharAt {
    display: flex;
    align-items: center;
    > span:first-child {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      color: #fff;
      font-family: PingFang SC;
      font-size: 20px;
      font-weight: 400;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      background: #356df6;
      margin-right: 10px;
    }
  }
  .base-info {
    padding: 20px 0 32px;
    .one-item,
    .third-item,
    .two-third-item {
      display: inline-flex;
      font-family: PingFang SC;
      font-style: normal;
      font-weight: 400;
      border: 1px solid #eeeff3;
      border-bottom: 0;
      &:last-child {
        border-bottom: 1px solid #eeeff3;
      }
      > span:first-child {
        display: inline-block;
        line-height: 44px;
        padding-left: 16px;
        width: 152px;
        font-size: 14px;
        color: #4b5666;
        background: #fafafa;
      }
      > span:last-child {
        display: inline-block;
        height: 100%;
        line-height: 44px;
        padding-left: 16px;
        width: calc(100% - 184px);
        color: #1a262c;
        font-size: 16px;
      }
    }
    .third-item {
      width: calc((100% - 6px) / 3);
    }
    .two-third-item {
      width: calc((100% - 4px) / 2);
    }
    .one-item {
      width: 100%;
    }
  }
  .stockholder-info,
  .outward-investment,
  .main-personnel,
  .branch-office,
  .change-log {
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
