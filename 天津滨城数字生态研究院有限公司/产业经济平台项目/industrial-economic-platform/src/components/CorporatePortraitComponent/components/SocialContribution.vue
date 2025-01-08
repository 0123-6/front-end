<script>
import { defineComponent } from 'vue';
import { socialContributionApis } from '@/api/corporate-portrait';
import mixinOpenWindow from '@/utils/mixinOpenWindow';

export default defineComponent({
  name: 'SocialContribution',
  mixins: [mixinOpenWindow],
  props: {
    companyId: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      EmployeeRecordTableCurrentPage: 1,
      EmployeeRecordTablePageSize: 10,
      EmployeeRecordTableTotal: 0,
      EmployeeRecordTableData: [],
      EmployeeRecordLoading: false,
      RecruitmentSituationTableCurrentPage: 1,
      RecruitmentSituationTablePageSize: 10,
      RecruitmentSituationTableTotal: 0,
      RecruitmentSituationTableData: [],
      recruitmentLoading: false,
      TaxEvaluationTableCurrentPage: 1,
      TaxEvaluationTablePageSize: 10,
      TaxEvaluationTableTotal: 0,
      TaxEvaluationTableData: [],
      TaxEvaluationLoading: false,
      TaxPaymentTableCurrentPage: 1,
      TaxPaymentTablePageSize: 10,
      TaxPaymentTableTotal: 0,
      TaxPaymentTableData: [],
      TaxPaymentLoading: false,
      CreditRatingTableCurrentPage: 1,
      CreditRatingTablePageSize: 10,
      CreditRatingTableTotal: 0,
      CreditRatingTableData: [],
      CreditRatingLoading: false
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
      ['EmployeeRecord', 'RecruitmentSituation', 'TaxEvaluation', 'TaxPayment', 'CreditRating'].forEach((n) => {
        this.getTableData(n);
      });
    },
    getTableData(dataProp, order, column) {
      const apiName = `get${dataProp}TableData`;
      this[dataProp + 'Loading'] = true;
      socialContributionApis[apiName]({
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
    <div class="title">就业人数</div>
    <div class="sub-title"><span></span><span>在册员工</span></div>
    <div class="employee-record">
      <el-table :data="EmployeeRecordTableData" stripe style="width: 100%">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="statisticYear" label="年份">
          <template slot-scope="scope">
            <span>{{ scope.row.statisticYear || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="employeeNum" label="在册员工">
          <template slot-scope="scope">
            <span>{{ scope.row.employeeNum ? scope.row.employeeNum + '人' : '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="EmployeeRecordTableTotal > EmployeeRecordTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'EmployeeRecord')"
        @current-change="changePage($event, 'EmployeeRecord')"
        :current-page="EmployeeRecordTableCurrentPage"
        :page-size="EmployeeRecordTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="EmployeeRecordTableTotal">
      </el-pagination>
    </div>
    <div class="sub-title"><span></span><span>招聘情况</span></div>
    <div class="recruitment-situation">
      <el-table :data="RecruitmentSituationTableData" stripe style="width: 100%" @sort-change="sortChange($event, 'RecruitmentSituation')">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="publishTime" label="发布日期" width="120" sortable="custom">
          <template slot-scope="scope">
            <span>{{ scope.row.publishTime || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="recruitmentPosition" label="招聘职位" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.recruitmentPosition || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="salary" label="月薪" width="120" sortable="custom">
          <template slot-scope="scope">
            <span>{{ scope.row.salary || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="education" label="学历" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.education || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="experience" label="经验" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.experience || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="regionName" label="办公地点" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.regionName || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="RecruitmentSituationTableTotal > RecruitmentSituationTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'RecruitmentSituation')"
        @current-change="changePage($event, 'RecruitmentSituation')"
        :current-page="RecruitmentSituationTableCurrentPage"
        :page-size="RecruitmentSituationTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="RecruitmentSituationTableTotal">
      </el-pagination>
    </div>
    <div class="title">税级评价</div>
    <div class="tax-evaluation">
      <el-table :data="TaxEvaluationTableData" stripe style="width: 100%">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="evaluationYear" label="评价年度" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.evaluationYear || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="evaluationLevel" label="纳税人信用级别" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.evaluationLevel || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.type || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taxpayerNo" label="纳税人识别号" width="250">
          <template slot-scope="scope">
            <span>{{ scope.row.taxpayerNo || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="evaluationOrg" label="评价单位" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.evaluationOrgs && scope.row.evaluationOrgs.length > 0">
              <div v-for="item of scope.row.evaluationOrgs" :key="item.value">
                <el-button v-if="item.clicked" class="ee-button--grid ell" type="text" @click="toCorporatePortrait(item.value)">
                  {{ item.label }}
                </el-button>
                <span v-if="!item.clicked">{{ item.label }}</span>
              </div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="TaxEvaluationTableTotal > TaxEvaluationTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'TaxEvaluation')"
        @current-change="changePage($event, 'TaxEvaluation')"
        :current-page="TaxEvaluationTableCurrentPage"
        :page-size="TaxEvaluationTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="TaxEvaluationTableTotal">
      </el-pagination>
    </div>
    <div class="title">税收缴纳</div>
    <div class="tax-payment">
      <el-table :data="TaxPaymentTableData" stripe style="width: 100%">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="evaluationDate" label="评价年份">
          <template slot-scope="scope">
            <span>{{ scope.row.evaluationDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taxExpense" label="所得税（万人民币）">
          <template slot-scope="scope">
            <span>{{ scope.row.taxExpense || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="TaxPaymentTableTotal > TaxPaymentTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'TaxPayment')"
        @current-change="changePage($event, 'TaxPayment')"
        :current-page="TaxPaymentTableCurrentPage"
        :page-size="TaxPaymentTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="TaxPaymentTableTotal">
      </el-pagination>
    </div>
    <div class="title">信用评级</div>
    <div class="credit-rating">
      <el-table :data="CreditRatingTableData" stripe style="width: 100%">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="ratingCompany" label="评级公司" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.ratingCompanys && scope.row.ratingCompanys.length > 0">
              <div v-for="item of scope.row.ratingCompanys" :key="item.value">
                <el-button v-if="item.clicked" class="ee-button--grid ell" type="text" @click="toCorporatePortrait(item.value)">
                  {{ item.label }}
                </el-button>
                <span v-if="!item.clicked">{{ item.label }}</span>
              </div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column prop="subjectLevel" label="主体等级" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.subjectLevel || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bondCreditLevel" label="债券信用等级" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.bondCreditLevel || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ratingOutlook" label="评级展望" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.ratingOutlook || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ratingDate" label="评级日期" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.ratingDate || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="CreditRatingTableTotal > CreditRatingTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'CreditRating')"
        @current-change="changePage($event, 'CreditRating')"
        :current-page="CreditRatingTableCurrentPage"
        :page-size="CreditRatingTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="CreditRatingTableTotal">
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
  .sub-title {
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 20px;
    span:first-child {
      display: inline-block;
      width: 2px;
      height: 16px;
      background: #356df6;
      margin-right: 8px;
    }
    span:last-child {
      color: rgba(0, 0, 0, 0.85);
      font-family: PingFang SC;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
    }
  }
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
  .employee-record,
  .recruitment-situation,
  .tax-evaluation,
  .tax-payment,
  .credit-rating {
    padding-bottom: 32px;
    margin-top: 20px;
  }
  ::v-deep .el-table .cell {
    height: auto;
  }
}
</style>
