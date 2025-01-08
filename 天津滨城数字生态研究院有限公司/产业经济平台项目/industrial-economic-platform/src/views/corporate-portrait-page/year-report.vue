<script>
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import { yearReportApis } from '@/api/corporate-portrait';
import mixinOpenWindow from '@/utils/mixinOpenWindow';

export default defineComponent({
  name: 'YearReport',
  mixins: [mixinOpenWindow],
  data() {
    return {
      loading: false,
      year: '',
      yearReportInfo: {},
      shareholderContributionInfoTableCurrentPage: 1,
      shareholderContributionInfoTablePageSize: 10,
      shareholderContributionInfoTableTotal: 0,
      shareholderContributionInfoTableData: [],
      companyStatusMap: {},
      keyCompanyMap: {}
    };
  },
  computed: {
    ...mapGetters([])
  },
  created() {
    this.handleColor(JSON.parse(localStorage.getItem('iep_platform_all_dict')));
  },
  mounted() {
    this.year = this.$route.params.year;
    this.getYearReportInfo();
  },
  methods: {
    handleColor(data) {
      this.companyStatusMap = new Map(data?.company_status.map((item) => [item.itemCode, item]));
      this.keyCompanyMap = new Map(data?.key_company.map((item) => [item.itemCode, item]));
    },
    // 序号排序
    indexMethod(currentPage, pageSize) {
      return (index) => (currentPage - 1) * pageSize + index + 1;
    },
    // 每页选择
    changeSize(val, currentPage, pageSize) {
      // eslint-disable-next-line no-param-reassign
      pageSize = val;
      // eslint-disable-next-line no-param-reassign
      currentPage = 1;
    },
    // 分页
    changePage(val, currentPage, pageSize) {
      // eslint-disable-next-line no-param-reassign
      currentPage = val;
    },
    getYearReportInfo() {
      this.loading = true;
      yearReportApis
        .getYearReportInfoData({ annualReportId: this.$route.params.id })
        .then(({ data }) => {
          if (data) {
            this.yearReportInfo = data;
            this.shareholderContributionInfoTableData = data.sccList;
            this.shareholderContributionInfoTableTotal = data.sccList?.length;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 返回
    returnBack() {
      this.$router.go(-1);
      sessionStorage.setItem('activeTab', 'business');
    }
  }
});
</script>

<template>
  <div class="container">
    <div class="ee-view-content">
      <div class="back-bar">
        <div class="ee-view-title is-noborder d-flex ai-center">
          <el-button class="ee-button--back" type="text" icon="el-icon-arrow-left" @click="returnBack">返回</el-button>
          <span class="ee-split"></span>
          <span class="title">{{ year }}企业年报</span>
        </div>
      </div>
      <div v-loading="loading" class="report-content">
        <div class="title">企业基本信息</div>
        <div class="enterprise-basic-info">
          <table class="eee-table" style="width: 100%">
            <colgroup>
              <col width="17%" />
              <col width="17%" />
              <col width="17%" />
              <col width="17%" />
              <col width="16%" />
              <col width="16%" />
            </colgroup>
            <tbody>
              <tr>
                <td class="cell-label">统一社会信用代码</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.basicInfo?.creditNo" class="f-d-din">{{ yearReportInfo.basicInfo.creditNo }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">注册号</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.basicInfo?.regNo" class="f-d-din">{{ yearReportInfo.basicInfo.regNo }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">企业经营状态</td>
                <td class="cell-value">
                  {{ companyStatusMap.get(yearReportInfo.basicInfo?.regStatus)?.itemName || '企业选择不公示' }}
                </td>
              </tr>
              <tr>
                <td class="cell-label">企业联系电话</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.basicInfo?.tel" class="f-d-din">{{ yearReportInfo.basicInfo.tel }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">电子邮箱</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.basicInfo?.email" class="f-d-din">{{ yearReportInfo.basicInfo.email }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">邮政编码</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.basicInfo?.postcode" class="f-d-din">{{ yearReportInfo.basicInfo.postcode }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
              </tr>
              <tr>
                <td class="cell-label">从业人数</td>
                <td class="cell-value">
                  <template v-if="yearReportInfo.basicInfo?.empoyeeCount">
                    <span class="f-d-din">{{ yearReportInfo.basicInfo.empoyeeCount }}</span
                    >人
                  </template>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">企业通讯地址</td>
                <td class="cell-value" colspan="3">
                  <span>{{ yearReportInfo.basicInfo?.address || '企业选择不公示' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="title">股东及出资信息</div>
        <div class="shareholder-contribution-info">
          <el-table :data="shareholderContributionInfoTableData" stripe style="width: 100%">
            <el-table-column
              label="序号"
              type="index"
              width="80"
              :index="indexMethod(shareholderContributionInfoTableCurrentPage, shareholderContributionInfoTablePageSize)" />
            <el-table-column prop="shareholderName" label="发起人" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button v-if="scope.row.clicked" class="ee-button--grid ell" type="text" @click="toCorporatePortrait(scope.row.shareholderId)">
                  {{ scope.row.shareholderName || '企业选择不公示' }}
                </el-button>
                <span v-else>{{ scope.row.shareholderName || '企业选择不公示' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sccAmount" label="认缴出资额（万）" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.sccAmount || '企业选择不公示' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sccDate" label="认缴出资日期" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.sccDate || '企业选择不公示' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="conformType" label="认缴出资方式" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.conformType || '企业选择不公示' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="accAmount" label="实缴出资额（万）" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.accAmount || '企业选择不公示' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="accDate" label="实缴出资日期" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.accDate || '企业选择不公示' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="accType" label="实缴出资方式" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.accType || '企业选择不公示' }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-show="shareholderContributionInfoTableTotal > shareholderContributionInfoTablePageSize"
            class="pagination"
            @size-change="changeSize($event, shareholderContributionInfoTableCurrentPage, shareholderContributionInfoTablePageSize)"
            @current-change="changePage($event, shareholderContributionInfoTableCurrentPage, shareholderContributionInfoTablePageSize)"
            :current-page="shareholderContributionInfoTableCurrentPage"
            :page-size="shareholderContributionInfoTablePageSize"
            layout="total, sizes, prev, pager, next"
            :total="shareholderContributionInfoTableTotal">
          </el-pagination>
        </div>
        <div class="title">企业资产信息</div>
        <div class="enterprise-asset-info">
          <table class="eee-table" style="width: 100%">
            <colgroup>
              <col width="16%" />
              <col width="16%" />
              <col width="17%" />
              <col width="17%" />
              <col width="17%" />
              <col width="17%" />
            </colgroup>
            <tbody>
              <tr>
                <td class="cell-label">资产总额</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.assessInfo?.assetAmount" class="f-d-din">{{ yearReportInfo.assessInfo.assetAmount }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">所有者权益合计</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.assessInfo?.ownerEquityAmount" class="f-d-din">{{ yearReportInfo.assessInfo.ownerEquityAmount }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">销售总额（营业总收入）</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.assessInfo?.revenueAmount" class="f-d-din">{{ yearReportInfo.assessInfo.revenueAmount }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
              </tr>
              <tr>
                <td class="cell-label">利润总额</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.assessInfo?.profitAmount" class="f-d-din">{{ yearReportInfo.assessInfo.profitAmount }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">净利润</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.assessInfo?.netProfitAmount" class="f-d-din">{{ yearReportInfo.assessInfo.netProfitAmount }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">主营业务收入</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.assessInfo?.majorRevenueAmount" class="f-d-din">{{ yearReportInfo.assessInfo.majorRevenueAmount }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
              </tr>
              <tr>
                <td class="cell-label">纳税总额</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.assessInfo?.taxAmount" class="f-d-din">{{ yearReportInfo.assessInfo.taxAmount }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">负债总额</td>
                <td class="cell-value" colspan="3">
                  <span v-if="yearReportInfo.assessInfo?.debtAmount" class="f-d-din">{{ yearReportInfo.assessInfo.debtAmount }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="title">企业社保信息</div>
        <div class="enterprise-social-security-info">
          <table class="eee-table" style="width: 100%">
            <colgroup>
              <col width="17%" />
              <col width="17%" />
              <col width="17%" />
              <col width="17%" />
              <col width="16%" />
              <col width="16%" />
            </colgroup>
            <tbody>
              <tr>
                <td class="cell-label">城镇职工基本养老保险</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.socialInsurance?.so110Count" class="f-d-din">{{ yearReportInfo.socialInsurance.so110Count }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">职工基本医疗保险</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.socialInsurance?.so310Count" class="f-d-din">{{ yearReportInfo.socialInsurance.so310Count }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">生育保险</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.socialInsurance?.so510Count" class="f-d-din">{{ yearReportInfo.socialInsurance.so510Count }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
              </tr>
              <tr>
                <td class="cell-label">失业保险</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.socialInsurance?.so210Count" class="f-d-din">{{ yearReportInfo.socialInsurance.so210Count }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">工伤保险</td>
                <td class="cell-value" colspan="3">
                  <span v-if="yearReportInfo.socialInsurance?.so410Count" class="f-d-din">{{ yearReportInfo.socialInsurance.so410Count }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="sub-title"><span></span><span>单位缴纳基数</span></div>
        <div class="unit-payment-base">
          <table class="eee-table" style="width: 100%">
            <colgroup>
              <col width="30%" />
              <col width="20%" />
              <col width="30%" />
              <col width="20%" />
            </colgroup>
            <tbody>
              <tr>
                <td class="cell-label">单位参加城镇职工基本养老保险缴费基数</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.socialInsurance?.so110BaseAmount" class="f-d-din">{{
                    yearReportInfo.socialInsurance.so110BaseAmount
                  }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">单位参加失业保险缴费基数</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.socialInsurance?.so210BaseAmount" class="f-d-din">{{
                    yearReportInfo.socialInsurance.so210BaseAmount
                  }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
              </tr>
              <tr>
                <td class="cell-label">单位参加职工基本医疗保险缴费基数</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.socialInsurance?.so310BaseAmount" class="f-d-din">{{
                    yearReportInfo.socialInsurance.so310BaseAmount
                  }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">单位参加工伤保险缴费基数</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.socialInsurance?.so410BaseAmount" class="f-d-din">{{
                    yearReportInfo.socialInsurance.so410BaseAmount
                  }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
              </tr>
              <tr>
                <td class="cell-label">单位参加生育保险缴费基数</td>
                <td class="cell-value" colspan="3">
                  <span v-if="yearReportInfo.socialInsurance?.so510BaseAmount" class="f-d-din">{{
                    yearReportInfo.socialInsurance.so510BaseAmount
                  }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="sub-title"><span></span><span>本期实际缴纳金额</span></div>
        <div class="amount-actually-paid">
          <table class="eee-table" style="width: 100%">
            <colgroup>
              <col width="30%" />
              <col width="20%" />
              <col width="30%" />
              <col width="20%" />
            </colgroup>
            <tbody>
              <tr>
                <td class="cell-label">参加城镇职工基本养老保险本期实际缴费金额</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.socialInsurance?.so110PaymentAmount" class="f-d-din">{{
                    yearReportInfo.socialInsurance.so110PaymentAmount
                  }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">参加失业保险本期实际缴费金额</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.socialInsurance?.so210PaymentAmount" class="f-d-din">{{
                    yearReportInfo.socialInsurance.so210PaymentAmount
                  }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
              </tr>
              <tr>
                <td class="cell-label">参加职工基本医疗保险本期实际缴费金额</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.socialInsurance?.so310PaymentAmount" class="f-d-din">{{
                    yearReportInfo.socialInsurance.so310PaymentAmount
                  }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">参加工伤保险本期实际缴费金额</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.socialInsurance?.so410PaymentAmount" class="f-d-din">{{
                    yearReportInfo.socialInsurance.so410PaymentAmount
                  }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
              </tr>
              <tr>
                <td class="cell-label">参加生育保险本期实际缴费金额</td>
                <td class="cell-value" colspan="3">
                  <span v-if="yearReportInfo.socialInsurance?.so510PaymentAmount" class="f-d-din">{{
                    yearReportInfo.socialInsurance.so510PaymentAmount
                  }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="sub-title"><span></span><span>单位累计欠缴金额</span></div>
        <div class="accumulative-amount-arrears">
          <table class="eee-table" style="width: 100%">
            <colgroup>
              <col width="30%" />
              <col width="20%" />
              <col width="30%" />
              <col width="20%" />
            </colgroup>
            <tbody>
              <tr>
                <td class="cell-label">单位参加城镇职工基本养老保险累计欠缴金额</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.socialInsurance?.so110ArrearsAmount" class="f-d-din">{{
                    yearReportInfo.socialInsurance.so110ArrearsAmount
                  }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">单位参加失业保险累计欠缴金额</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.socialInsurance?.so210ArrearsAmount" class="f-d-din">{{
                    yearReportInfo.socialInsurance.so210ArrearsAmount
                  }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
              </tr>
              <tr>
                <td class="cell-label">单位参加职工基本医疗保险累计欠缴金额</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.socialInsurance?.so310ArrearsAmount" class="f-d-din">{{
                    yearReportInfo.socialInsurance.so310ArrearsAmount
                  }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
                <td class="cell-label">单位参加工伤保险累计欠缴金额</td>
                <td class="cell-value">
                  <span v-if="yearReportInfo.socialInsurance?.so410ArrearsAmount" class="f-d-din">{{
                    yearReportInfo.socialInsurance.so410ArrearsAmount
                  }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
              </tr>
              <tr>
                <td class="cell-label">单位参加生育保险累计欠缴金额</td>
                <td class="cell-value" colspan="3">
                  <span v-if="yearReportInfo.socialInsurance?.so510ArrearsAmount" class="f-d-din">{{
                    yearReportInfo.socialInsurance.so510ArrearsAmount
                  }}</span>
                  <span v-else>企业选择不公示</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  background: #f8f9fb;
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
    margin-top: 10px;
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
  .year-title {
    margin: 16px 24px 16px 0;
    color: #1a262c;
    font-family: PingFang SC;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
  }
  .report-content {
    padding: 24px;
    background: #fff;
    box-shadow: 0 0 16px rgba(20, 38, 82, 0.07);
    .enterprise-basic-info,
    .enterprise-asset-info,
    .enterprise-social-security-info,
    .unit-payment-base,
    .amount-actually-paid,
    .accumulative-amount-arrears {
      padding: 20px 0 32px;
      .one-item,
      .third-item,
      .two-third-item {
        display: inline-block;
        height: 44px;
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
          height: 100%;
          line-height: 44px;
          padding-left: 16px;
          width: 172px;
          font-size: 14px;
          color: #4b5666;
          background: #fafafa;
        }
        > span:last-child {
          display: inline-block;
          height: 100%;
          line-height: 44px;
          padding-left: 16px;
          width: calc(100% - 204px);
          color: #1a262c;
          font-size: 16px;
        }
      }
      .third-item {
        width: calc((100% - 6px) / 3);
      }
      .two-third-item {
        width: calc((100% - 3px) / 3 * 2);
      }
      .one-item {
        width: 100%;
      }

      .half-item {
        width: calc((100% - 4px) / 2);
        display: inline-block;
        height: 44px;
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
          height: 100%;
          line-height: 44px;
          padding-left: 16px;
          width: 346px;
          font-size: 14px;
          color: #4b5666;
          background: #fafafa;
        }
        > span:last-child {
          display: inline-block;
          height: 100%;
          line-height: 44px;
          padding-left: 16px;
          width: calc(100% - 378px);
          color: #1a262c;
          font-size: 16px;
        }
      }
    }
    .shareholder-contribution-info {
      padding-bottom: 32px;
      .el-table {
        margin-top: 20px;
      }
    }
  }
}
</style>
