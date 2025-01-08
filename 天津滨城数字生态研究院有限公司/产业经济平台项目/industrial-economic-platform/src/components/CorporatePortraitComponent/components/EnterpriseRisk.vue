<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EnterpriseRisk',
  data() {
    return {
      legalRiskTableCurrentPage: 1,
      legalRiskTablePageSize: 10,
      legalRiskTableTotal: 0,
      legalRiskTableData: [],
      hearingNoticeTableCurrentPage: 1,
      hearingNoticeTablePageSize: 10,
      hearingNoticeTableTotal: 0,
      hearingNoticeTableData: [],
      courtAnnouncementTableCurrentPage: 1,
      courtAnnouncementTablePageSize: 10,
      courtAnnouncementTableTotal: 0,
      courtAnnouncementTableData: [],
      executionPersonTableCurrentPage: 1,
      executionPersonTablePageSize: 10,
      executionPersonTableTotal: 0,
      executionPersonTableData: [],
      filingInformationTableCurrentPage: 1,
      filingInformationTablePageSize: 10,
      filingInformationTableTotal: 0,
      filingInformationTableData: [],
      equityPledgeTableCurrentPage: 1,
      equityPledgeTablePageSize: 10,
      equityPledgeTableTotal: 0,
      equityPledgeTableData: [],
      chattelMortgageTableCurrentPage: 1,
      chattelMortgageTablePageSize: 10,
      chattelMortgageTableTotal: 0,
      chattelMortgageTableData: [],
      operatingAnomalyTableCurrentPage: 1,
      operatingAnomalyTablePageSize: 10,
      operatingAnomalyTableTotal: 0,
      operatingAnomalyTableData: [],
      violationLawTableCurrentPage: 1,
      violationLawTablePageSize: 10,
      violationLawTableTotal: 0,
      violationLawTableData: [],
      testResultTableCurrentPage: 1,
      testResultTablePageSize: 10,
      testResultTableTotal: 0,
      testResultTableData: [],
      administrativePunishmentTableCurrentPage: 1,
      administrativePunishmentTablePageSize: 10,
      administrativePunishmentTableTotal: 0,
      administrativePunishmentTableData: [],
      corporateOpinionTableCurrentPage: 1,
      corporateOpinionTablePageSize: 10,
      corporateOpinionTableTotal: 0,
      corporateOpinionTableData: []
    };
  },
  methods: {
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
    }
  }
});
</script>

<template>
  <div class="container">
    <div class="title">司法风险</div>
    <div class="sub-title"><span></span><span>法律风险</span></div>
    <div class="legal-risk">
      <el-table
          :data="legalRiskTableData"
          stripe
          border
          style="width: 100%">
        <el-table-column
            label="序号"
            type="index"
            width="80"
            :index="indexMethod(legalRiskTableCurrentPage, legalRiskTablePageSize)"
        />
        <el-table-column
            prop="listDate"
            label="案件名称">
        </el-table-column>
        <el-table-column
            prop="totmktcap"
            label="案由">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="在本案中身份">
        </el-table-column>
      </el-table>
      <el-pagination
          class="pagination"
          @size-change="changeSize($event, legalRiskTableCurrentPage, legalRiskTablePageSize)"
          @current-change="changePage($event, legalRiskTableCurrentPage, legalRiskTablePageSize)"
          :current-page="legalRiskTableCurrentPage"
          :page-size="legalRiskTablePageSize"
          layout="total, sizes, prev, pager, next"
          :total="legalRiskTableTotal">
      </el-pagination>
    </div>
    <div class="sub-title"><span></span><span>开庭公告</span></div>
    <div class="hearing-notice">
      <el-table
          :data="hearingNoticeTableData"
          stripe
          border
          style="width: 100%">
        <el-table-column
            label="序号"
            type="index"
            width="80"
            :index="indexMethod(hearingNoticeTableCurrentPage, hearingNoticeTablePageSize)"
        />
        <el-table-column
            prop="listDate"
            label="开庭日期">
        </el-table-column>
        <el-table-column
            prop="totmktcap"
            label="案号">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="案由">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="当事人">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="法院">
        </el-table-column>
      </el-table>
      <el-pagination
          class="pagination"
          @size-change="changeSize($event, hearingNoticeTableCurrentPage, hearingNoticeTablePageSize)"
          @current-change="changePage($event, hearingNoticeTableCurrentPage, hearingNoticeTablePageSize)"
          :current-page="hearingNoticeTableCurrentPage"
          :page-size="hearingNoticeTablePageSize"
          layout="total, sizes, prev, pager, next"
          :total="hearingNoticeTableTotal">
      </el-pagination>
    </div>
    <div class="sub-title"><span></span><span>法院公告</span></div>
    <div class="court-announcement">
      <el-table
          :data="courtAnnouncementTableData"
          stripe
          border
          style="width: 100%">
        <el-table-column
            label="序号"
            type="index"
            width="80"
            :index="indexMethod(courtAnnouncementTableCurrentPage, courtAnnouncementTablePageSize)"
        />
        <el-table-column
            prop="listDate"
            label="案号">
        </el-table-column>
        <el-table-column
            prop="totmktcap"
            label="公告类型">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="当事人">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="法院">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="刊登日期">
        </el-table-column>
      </el-table>
      <el-pagination
          class="pagination"
          @size-change="changeSize($event, courtAnnouncementTableCurrentPage, courtAnnouncementTablePageSize)"
          @current-change="changePage($event, courtAnnouncementTableCurrentPage, courtAnnouncementTablePageSize)"
          :current-page="courtAnnouncementTableCurrentPage"
          :page-size="courtAnnouncementTablePageSize"
          layout="total, sizes, prev, pager, next"
          :total="courtAnnouncementTableTotal">
      </el-pagination>
    </div>
    <div class="sub-title"><span></span><span>被执行人</span></div>
    <div class="execution-person">
      <el-table
          :data="executionPersonTableData"
          stripe
          border
          style="width: 100%">
        <el-table-column
            label="序号"
            type="index"
            width="80"
            :index="indexMethod(executionPersonTableCurrentPage, executionPersonTablePageSize)"
        />
        <el-table-column
            prop="listDate"
            label="立案日期">
        </el-table-column>
        <el-table-column
            prop="totmktcap"
            label="案号">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="身份证号码/组织机构代码">
        </el-table-column>
        <el-table-column
            prop="totmktcap"
            label="执行标准">
        </el-table-column>
        <el-table-column
            prop="totmktcap"
            label="执行法院">
        </el-table-column>
      </el-table>
      <el-pagination
          class="pagination"
          @size-change="changeSize($event, executionPersonTableCurrentPage, executionPersonTablePageSize)"
          @current-change="changePage($event, executionPersonTableCurrentPage, executionPersonTablePageSize)"
          :current-page="executionPersonTableCurrentPage"
          :page-size="executionPersonTablePageSize"
          layout="total, sizes, prev, pager, next"
          :total="executionPersonTableTotal">
      </el-pagination>
    </div>
    <div class="sub-title"><span></span><span>立案信息</span></div>
    <div class="filing-information">
      <el-table
          :data="filingInformationTableData"
          stripe
          border
          style="width: 100%">
        <el-table-column
            label="序号"
            type="index"
            width="80"
            :index="indexMethod(filingInformationTableCurrentPage, filingInformationTablePageSize)"
        />
        <el-table-column
            prop="listDate"
            label="立案日期">
        </el-table-column>
        <el-table-column
            prop="totmktcap"
            label="案号">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="当事人">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="法院">
        </el-table-column>
      </el-table>
      <el-pagination
          class="pagination"
          @size-change="changeSize($event, filingInformationTableCurrentPage, filingInformationTablePageSize)"
          @current-change="changePage($event, filingInformationTableCurrentPage, filingInformationTablePageSize)"
          :current-page="filingInformationTableCurrentPage"
          :page-size="filingInformationTablePageSize"
          layout="total, sizes, prev, pager, next"
          :total="filingInformationTableTotal">
      </el-pagination>
    </div>
    <div class="title">经营风险</div>
    <div class="sub-title"><span></span><span>股权出质情况</span></div>
    <div class="equity-pledge">
      <el-table
          :data="equityPledgeTableData"
          stripe
          border
          style="width: 100%">
        <el-table-column
            label="序号"
            type="index"
            width="80"
            :index="indexMethod(equityPledgeTableCurrentPage, equityPledgeTablePageSize)"
        />
        <el-table-column
            prop="listDate"
            label="股权出质设立登记日期">
        </el-table-column>
        <el-table-column
            prop="totmktcap"
            label="登记编号">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="出质人">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="出质股权标的企业">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="质权人">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="出质股权数额">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="状态">
        </el-table-column>
      </el-table>
      <el-pagination
          class="pagination"
          @size-change="changeSize($event, equityPledgeTableCurrentPage, equityPledgeTablePageSize)"
          @current-change="changePage($event, equityPledgeTableCurrentPage, equityPledgeTablePageSize)"
          :current-page="equityPledgeTableCurrentPage"
          :page-size="equityPledgeTablePageSize"
          layout="total, sizes, prev, pager, next"
          :total="equityPledgeTableTotal">
      </el-pagination>
    </div>
    <div class="sub-title"><span></span><span>动产抵押情况</span></div>
    <div class="chattel-mortgage">
      <el-table
          :data="chattelMortgageTableData"
          stripe
          border
          style="width: 100%">
        <el-table-column
            label="序号"
            type="index"
            width="80"
            :index="indexMethod(chattelMortgageTableCurrentPage, chattelMortgageTablePageSize)"
        />
        <el-table-column
            prop="listDate"
            label="债券种类">
        </el-table-column>
        <el-table-column
            prop="totmktcap"
            label="债券数额">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="履行日期">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="登记编号">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="登记日期">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="公示日期">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="登记机关">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="抵押物名称">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="抵押权人名称">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="所有权归属">
        </el-table-column>
      </el-table>
      <el-pagination
          class="pagination"
          @size-change="changeSize($event, chattelMortgageTableCurrentPage, chattelMortgageTablePageSize)"
          @current-change="changePage($event, chattelMortgageTableCurrentPage, chattelMortgageTablePageSize)"
          :current-page="chattelMortgageTableCurrentPage"
          :page-size="chattelMortgageTablePageSize"
          layout="total, sizes, prev, pager, next"
          :total="chattelMortgageTableTotal">
      </el-pagination>
    </div>
    <div class="sub-title"><span></span><span>经营异常情况</span></div>
    <div class="operating-anomaly">
      <el-table
          :data="operatingAnomalyTableData"
          stripe
          border
          style="width: 100%">
        <el-table-column
            label="序号"
            type="index"
            width="80"
            :index="indexMethod(operatingAnomalyTableCurrentPage, operatingAnomalyTablePageSize)"
        />
        <el-table-column
            prop="listDate"
            label="列入异常名录日期">
        </el-table-column>
        <el-table-column
            prop="totmktcap"
            label="列入异常名录原因">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="列入异常名录部门">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="移除异常名录日期">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="移除异常名录原因">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="移除异常名录部门">
        </el-table-column>
      </el-table>
      <el-pagination
          class="pagination"
          @size-change="changeSize($event, operatingAnomalyTableCurrentPage, operatingAnomalyTablePageSize)"
          @current-change="changePage($event, operatingAnomalyTableCurrentPage, operatingAnomalyTablePageSize)"
          :current-page="operatingAnomalyTableCurrentPage"
          :page-size="operatingAnomalyTablePageSize"
          layout="total, sizes, prev, pager, next"
          :total="operatingAnomalyTableTotal">
      </el-pagination>
    </div>
    <div class="sub-title"><span></span><span>严重违法情况</span></div>
    <div class="violation-law">
      <el-table
          :data="violationLawTableData"
          stripe
          border
          style="width: 100%">
        <el-table-column
            label="序号"
            type="index"
            width="80"
            :index="indexMethod(violationLawTableCurrentPage, violationLawTablePageSize)"
        />
        <el-table-column
            prop="listDate"
            label="列入日期">
        </el-table-column>
        <el-table-column
            prop="totmktcap"
            label="列入原因">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="列入部门">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="移除日期">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="移除原因">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="移除部门">
        </el-table-column>
      </el-table>
      <el-pagination
          class="pagination"
          @size-change="changeSize($event, violationLawTableCurrentPage, violationLawTablePageSize)"
          @current-change="changePage($event, violationLawTableCurrentPage, violationLawTablePageSize)"
          :current-page="violationLawTableCurrentPage"
          :page-size="violationLawTablePageSize"
          layout="total, sizes, prev, pager, next"
          :total="violationLawTableTotal">
      </el-pagination>
    </div>
    <div class="sub-title"><span></span><span>抽查结果</span></div>
    <div class="test-result">
      <el-table
          :data="testResultTableData"
          stripe
          border
          style="width: 100%">
        <el-table-column
            label="序号"
            type="index"
            width="80"
            :index="indexMethod(testResultTableCurrentPage, testResultTablePageSize)"
        />
        <el-table-column
            prop="listDate"
            label="抽查时间">
        </el-table-column>
        <el-table-column
            prop="totmktcap"
            label="抽查类型">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="抽查结果">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="抽查机关">
        </el-table-column>
      </el-table>
      <el-pagination
          class="pagination"
          @size-change="changeSize($event, testResultTableCurrentPage, testResultTablePageSize)"
          @current-change="changePage($event, testResultTableCurrentPage, testResultTablePageSize)"
          :current-page="testResultTableCurrentPage"
          :page-size="testResultTablePageSize"
          layout="total, sizes, prev, pager, next"
          :total="testResultTableTotal">
      </el-pagination>
    </div>
    <div class="sub-title"><span></span><span>行政处罚记录</span></div>
    <div class="administrative-punishment">
      <el-table
          :data="administrativePunishmentTableData"
          stripe
          border
          style="width: 100%">
        <el-table-column
            label="序号"
            type="index"
            width="80"
            :index="indexMethod(administrativePunishmentTableCurrentPage, administrativePunishmentTablePageSize)"
        />
        <el-table-column
            prop="listDate"
            label="处罚日期">
        </el-table-column>
        <el-table-column
            prop="决定文书号"
            label="决定文书号">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="处罚事由/违法行为类型">
        </el-table-column>
        <el-table-column
            prop="决定文书号"
            label="处罚结果/内容">
        </el-table-column>
        <el-table-column
            prop="决定文书号"
            label="处罚单位">
        </el-table-column>
        <el-table-column
            prop="决定文书号"
            label="数据来源">
        </el-table-column>
      </el-table>
      <el-pagination
          class="pagination"
          @size-change="changeSize($event, administrativePunishmentTableCurrentPage, administrativePunishmentTablePageSize)"
          @current-change="changePage($event, administrativePunishmentTableCurrentPage, administrativePunishmentTablePageSize)"
          :current-page="administrativePunishmentTableCurrentPage"
          :page-size="administrativePunishmentTablePageSize"
          layout="total, sizes, prev, pager, next"
          :total="administrativePunishmentTableTotal">
      </el-pagination>
    </div>
    <div class="title">企业舆情</div>
    <div class="corporate-opinion">
      <el-table
          :data="corporateOpinionTableData"
          stripe
          border
          style="width: 100%">
        <el-table-column
            label="序号"
            type="index"
            width="80"
            :index="indexMethod(corporateOpinionTableCurrentPage, corporateOpinionTablePageSize)"
        />
        <el-table-column
            prop="listDate"
            label="发布时间">
        </el-table-column>
        <el-table-column
            prop="totmktcap"
            label="舆情标题">
        </el-table-column>
        <el-table-column
            prop="pe"
            label="舆情链接">
        </el-table-column>
      </el-table>
      <el-pagination
          class="pagination"
          @size-change="changeSize($event, corporateOpinionTableCurrentPage, corporateOpinionTablePageSize)"
          @current-change="changePage($event, corporateOpinionTableCurrentPage, corporateOpinionTablePageSize)"
          :current-page="corporateOpinionTableCurrentPage"
          :page-size="corporateOpinionTablePageSize"
          layout="total, sizes, prev, pager, next"
          :total="corporateOpinionTableTotal">
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
      background: #356DF6;
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
  .legal-risk,
  .hearing-notice,
  .court-announcement,
  .execution-person,
  .filing-information,
  .equity-pledge,
  .chattel-mortgage,
  .operating-anomaly,
  .violation-law,
  .test-result,
  .administrative-punishment,
  .corporate-opinion {
    padding-bottom: 32px;
  }
  ::v-deep .el-table .cell {
    height: auto;
  }
}
</style>
