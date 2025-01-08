<template>
  <div class="scroll-item">
    <div class="line-title scroll-anchor">
      <h3><svg-icon icon-class="investment"></svg-icon>{{ title }}</h3>
    </div>
    <div>
      <el-row type="flex" class="shadow-row">
        <el-col v-loading="loading" :span="8" class="dashed-right-border">
          <BaseBarChart ref="chart1" :chartData="financingLinesData" :grid="{ left: 40 }"></BaseBarChart>
        </el-col>
        <el-col v-loading="loading" :span="8" class="dashed-right-border">
          <BaseBarChart ref="chart2" :chartData="financingEventData" color="#68CD44" />
        </el-col>
        <el-col v-loading="loading" :span="8">
          <TotalBarChart ref="chart3" :chartData="financingRoundsData"></TotalBarChart>
        </el-col>
      </el-row>
      <el-row type="flex" class="mt16 shadow-row">
        <el-col :span="24">
          <div v-loading="tableLoading" class="text-chart">
            <div class="chart-title table">
              投资公司（共计 {{ tableListTotal }} 条）
              <el-input class="ee-input" placeholder="请输入企业名称、投资方" v-model="searchWord" clearable @clear="searchTable">
                <el-button slot="append" icon="el-icon-search" @click="searchTable"></el-button>
              </el-input>
            </div>
            <div style="padding: 0 16px">
              <el-table :data="tableData" stripe>
                <el-table-column label="序号" prop="$index" width="80" align="left" />
                <el-table-column show-overflow-tooltip label="企业名称" prop="companyName" min-width="120">
                  <template slot-scope="scope">
                    <el-button class="ee-button--grid ell" type="text" @click="toCorporatePortrait(scope.row.companyId)">
                      {{ scope.row.companyName || scope.row.legalPersonName }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="区域" prop="regionName" min-width="60" />
                <el-table-column show-overflow-tooltip label="金额（亿元）" prop="investingAmount" width="120">
                  <template slot-scope="scope">
                    <span>{{ scope.row.investingAmount ? scope.row.investingAmount?.toFixed(2) : '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="轮次" prop="investingRound" min-width="60" />
                <el-table-column show-overflow-tooltip label="投资方" prop="investFullName" min-width="120">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.clicked" class="ee-button--grid ell" type="text" @click="toCorporatePortrait(scope.row.investId)">
                      {{ scope.row.investFullName }}
                    </el-button>
                    <span v-else>{{ scope.row.investFullName }}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="时间" prop="investingDate" width="130" />
              </el-table>
              <el-pagination
                v-show="tableListTotal > pageSize"
                class="mt16 pb16"
                layout="prev, pager, next, jumper"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                background
                :total="tableListTotal"
                @current-change="changePage">
              </el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import mixinOpenWindow from '@/utils/mixinOpenWindow';
import { analysisApis } from '@/api/structural-analysis';
import BaseBarChart from '@/components/BaseBarChart';
import TotalBarChart from '@/components/TotalBarChart';
export default {
  name: 'InvestAnalysis',
  mixins: [mixinOpenWindow],
  components: {
    BaseBarChart,
    TotalBarChart
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      loading: false,
      chartAmount: 3,
      financingLinesData: {},
      financingEventData: {},
      financingRoundsData: {},
      searchWord: '',
      tableListTotal: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      tableLoading: false
    };
  },
  watch: {
    params() {
      this.clearData();
      this.getData();
      this.searchTable();
    }
  },
  methods: {
    getData() {
      this.loading = true;
      this.$emit('loading', 1);
      analysisApis
        .getInvestAnalyse(this.params)
        .then((res) => {
          const result = res.data;
          this.financingLinesData = result.financingAmountData;
          this.financingLinesData.unit = '亿元';
          this.financingEventData = result.financingEventData;
          this.financingEventData.unit = '次';
          this.financingRoundsData = result.financingRoundsData;
          this.financingRoundsData.unit = '次';
          this.loading = false;
          this.$emit('loading', -1);
        })
        .catch((err) => {
          this.loading = false;
          this.$emit('loading', -1);
          console.log(err);
        });
    },
    changePage(val) {
      this.currentPage = val;
      this.getTableData();
    },
    searchTable() {
      this.changePage(1);
    },
    getTableData() {
      const params = {
        ...this.params,
        keyword: this.searchWord,
        pageSize: this.pageSize,
        pageNum: this.currentPage
      };
      this.tableLoading = true;
      this.$emit('loading', 1);
      analysisApis
        .getInvestList(params)
        .then((result) => {
          this.tableData = result.data.list.map((n, i) => {
            n.$index = this.$getRowIndex(i, this.currentPage, this.pageSize);
            return n;
          });
          this.tableListTotal = result.data.total;
          this.tableLoading = false;
          this.$emit('loading', -1);
        })
        .catch((err) => {
          console.log(err);
          this.tableLoading = false;
          this.$emit('loading', -1);
        });
    },
    clearData() {
      this.financingLinesData = {};
      this.financingEventData = {};
      this.financingRoundsData = {};
      this.searchWord = '';
      this.tableListTotal = 0;
      this.currentPage = 1;
      this.tableData = [];
    }
  }
};
</script>
