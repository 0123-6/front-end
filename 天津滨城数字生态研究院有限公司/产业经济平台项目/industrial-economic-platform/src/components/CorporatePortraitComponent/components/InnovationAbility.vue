<script>
import { defineComponent } from 'vue';
import { innovationAbilityApis } from '@/api/corporate-portrait';
import mixinOpenWindow from '@/utils/mixinOpenWindow';

export default defineComponent({
  name: 'InnovationAbility',
  mixins: [mixinOpenWindow],
  props: {
    companyId: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      PatentInformationTableCurrentPage: 1,
      PatentInformationTablePageSize: 10,
      PatentInformationTableTotal: 0,
      PatentInformationTableData: [],
      PatentInformationLoading: false,
      SoftwareLiteratureInformationTableCurrentPage: 1,
      SoftwareLiteratureInformationTablePageSize: 10,
      SoftwareLiteratureInformationTableTotal: 0,
      SoftwareLiteratureInformationTableData: [],
      SoftwareLiteratureInformationLoading: false,
      TrademarkInformationTableCurrentPage: 1,
      TrademarkInformationTablePageSize: 10,
      TrademarkInformationTableTotal: 0,
      TrademarkInformationTableData: [],
      TrademarkInformationLoading: false,
      StandardInformationTableCurrentPage: 1,
      StandardInformationTablePageSize: 10,
      StandardInformationTableTotal: 0,
      StandardInformationTableData: [],
      StandardInformationLoading: false,
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
      ['PatentInformation', 'StandardInformation', 'SoftwareLiteratureInformation', 'TrademarkInformation'].forEach((n) => {
        this.getTableData(n);
      });
    },
    getTableData(dataProp, order, column) {
      const apiName = `get${dataProp}TableData`;
      this[dataProp + 'Loading'] = true;
      innovationAbilityApis[apiName]({
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
              n.isCollapse = n.draftNameResps && n.draftNameResps.length > 2;
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
    toggleDisplay(index) {
      this.$set(this.showAll, index, !this.showAll[index]);
    }
  }
});
</script>

<template>
  <div class="container">
    <div class="title">专利信息</div>
    <div v-loading="PatentInformationLoading" class="patent-information">
      <el-table :data="PatentInformationTableData" stripe style="width: 100%" @sort-change="sortChange($event, 'PatentInformation')">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="patentName" label="发明名称" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="patentType" label="专利类型" width="100" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="legalStatus" label="法律状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color: #469e1a; border-radius: 2px; background: rgba(70, 158, 26, 0.1); padding: 2px 10px">{{ scope.row.legalStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyNo" label="申请号" width="150" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="applyDate" label="申请日期" sortable="custom" width="110"> </el-table-column>
        <el-table-column prop="publicationNo" label="公开（公告）号" width="130" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="publicationDate" label="公开（公告）日期" width="140" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="inventorAme" label="发明人" show-overflow-tooltip> </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="PatentInformationTableTotal > PatentInformationTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'PatentInformation')"
        @current-change="changePage($event, 'PatentInformation')"
        :current-page="PatentInformationTableCurrentPage"
        :page-size="PatentInformationTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="PatentInformationTableTotal">
      </el-pagination>
    </div>
    <div class="title">软件著作信息</div>
    <div v-loading="SoftwareLiteratureInformationLoading" class="software-literature-information">
      <el-table :data="SoftwareLiteratureInformationTableData" stripe style="width: 100%">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="softwareFullName" label="软件全称" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.softwareFullName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="softwareName" label="软件简称" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.softwareName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="versionNo" label="版本号" width="90" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.versionNo || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="regNo" label="登记号" width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.regNo || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="devDate" label="开发完成日期" width="110" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.devDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="initialPublicationDate" label="首次发布日期" width="110" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.initialPublicationDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="regDate" label="登记日期" width="110" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.regDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rightsMethod" label="权利取得方式" width="110" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.rightsMethod || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="SoftwareLiteratureInformationTableTotal > SoftwareLiteratureInformationTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'SoftwareLiteratureInformation')"
        @current-change="changePage($event, 'SoftwareLiteratureInformation')"
        :current-page="SoftwareLiteratureInformationTableCurrentPage"
        :page-size="SoftwareLiteratureInformationTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="SoftwareLiteratureInformationTableTotal">
      </el-pagination>
    </div>
    <div class="title">商标信息</div>
    <div v-loading="TrademarkInformationLoading" class="trademark-information">
      <el-table :data="TrademarkInformationTableData" stripe style="width: 100%" @sort-change="sortChange($event, 'TrademarkInformation')">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="tmImg" label="商标图案">
          <template slot-scope="scope">
            <span>{{ scope.row.tmImg || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tmName" label="商标名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.tmName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="globalClassification" label="国际分类" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.globalClassification || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tmStaus" label="商标状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color: #356df6; border-radius: 2px; background: rgba(53, 109, 246, 0.1); padding: 2px 10px">{{
              scope.row.tmStaus || '-'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyRegNo" label="申请/注册号" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.applyRegNo || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyDate" label="申请日期" sortable="custom" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.applyDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="regDate" label="注册公告日期" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.regDate || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="TrademarkInformationTableTotal > TrademarkInformationTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'TrademarkInformation')"
        @current-change="changePage($event, 'TrademarkInformation')"
        :current-page="TrademarkInformationTableCurrentPage"
        :page-size="TrademarkInformationTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="TrademarkInformationTableTotal">
      </el-pagination>
    </div>
    <div class="title">标准信息</div>
    <div v-loading="StandardInformationLoading" class="standard-information">
      <el-table :data="StandardInformationTableData" stripe style="width: 100%">
        <el-table-column label="序号" prop="$index" width="80" />
        <el-table-column prop="annualReportYear" label="标准号" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.standardNo || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="standard_no" label="标准级别" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.standardLevel || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="standard_level" label="标准属性" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.standardAttribute || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="standard_name" label="标准名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.standardName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="draft_name" label="起草单位" show-overflow-tooltip>
          <template slot-scope="scope">
            <!--            <div v-if="scope.row.draftNameResps.length > 0">-->
            <!--              <div v-for="item of scope.row.draftNameResps" :key="item.companyId">-->
            <!--                  <span v-if="item.clicked"-->
            <!--                        style="cursor: pointer; color: #0d7cdb"-->
            <!--                        @click="toCorporatePortrait(item.companyId)">{{item.draftName}}-->
            <!--                  </span>-->
            <!--                <span v-if="!item.clicked">{{item.draftName}}</span>-->
            <!--              </div>-->
            <!--            </div>-->
            <!--            <div v-else>-</div>-->
            <div v-if="scope.row.draftNameResps.length > 0">
              <div v-for="item of displayItems(scope.row.draftNameResps, scope.$index)" :key="item.companyId">
                <el-button v-if="item.clicked" class="ee-button--grid ell" type="text" @click="toCorporatePortrait(item.companyId)">
                  {{ item.draftName }}
                </el-button>
                <span v-else>{{ item.draftName }}</span>
              </div>
              <div v-if="scope.row.draftNameResps.length > 2" style="cursor: pointer; color: #0d7cdb" @click="toggleDisplay(scope.$index)">
                <span v-if="showAll[scope.$index]">收起</span>
                <span v-else>展开全部</span>
              </div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column prop="publish_date" label="发布日期" width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.publishDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="standardStatus" label="状态" width="100">
          <template slot-scope="scope">
            <span style="color: #469e1a; border-radius: 2px; background: rgba(70, 158, 26, 0.1); padding: 2px 10px">{{
              scope.row.standardStatus || '-'
            }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="StandardInformationTableTotal > StandardInformationTablePageSize"
        class="pagination"
        @size-change="changeSize($event, 'StandardInformation')"
        @current-change="changePage($event, 'StandardInformation')"
        :current-page="StandardInformationTableCurrentPage"
        :page-size="StandardInformationTablePageSize"
        layout="total, sizes, prev, pager, next"
        :total="StandardInformationTableTotal">
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
  .patent-information,
  .software-literature-information,
  .trademark-information,
  .standard-information {
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
