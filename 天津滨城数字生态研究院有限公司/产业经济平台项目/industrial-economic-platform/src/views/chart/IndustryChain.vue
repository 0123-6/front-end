<template>
  <div class="scroll-item">
    <div class="line-title scroll-anchor">
      <h3><svg-icon icon-class="chart"></svg-icon>{{ title }}</h3>
    </div>
    <div>
      <el-row type="flex" class="shadow-row">
        <el-col v-loading="loading" :class="treeLoading ? '' : 'ee-loading--none'" :span="14" class="dashed-right-border" style="background: #ffffff">
          <BaseTreeG6 ref="baseTree" :chartData="chainTreeData" :height="611" @nodeClick="changeEnterprisesData"></BaseTreeG6>
        </el-col>
        <el-col v-loading="loading" :span="10" class="chart-table-content enterprises-table" style="height: 611px; background: #fff">
          <el-table :data="tableData" stripe @filter-change="filterHandler">
            <el-table-column label="序号" prop="$index" width="80" align="left" />
            <el-table-column show-overflow-tooltip label="企业名称" sortable prop="companyName" min-width="160" align="left">
              <template slot-scope="scope">
                <el-button class="ee-button--grid ell" type="text" @click="toCorporatePortrait(scope.row.companyId)">
                  {{ scope.row.companyName || scope.row.legalPersonName }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="资质类别"
              prop="type"
              width="120"
              align="left"
              column-key="type"
              :filters="filterCompanyType">
              <template slot-scope="scope">
                <span
                  v-for="item of scope.row.typeCodes"
                  :key="item"
                  :style="{
                    padding: '2px 5px',
                    marginRight: '5px',
                    color: companyTypeMap?.get(item)?.color,
                    background: companyTypeMap?.get(item)?.backgroundColor
                  }">
                  {{ companyTypeMap?.get(item)?.itemName }}
                </span>
                <span
                  v-for="item of scope.row.types"
                  :key="item"
                  :style="{
                    padding: '2px 5px',
                    marginRight: '5px',
                    color: keyCompanyMap?.get(item)?.color,
                    background: keyCompanyMap?.get(item)?.backgroundColor
                  }">
                  {{ keyCompanyMap?.get(item)?.itemName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="所属区域" min-width="150" align="left">
              <template slot-scope="scope">
                {{ scope.row.provinceName }}
                {{ scope.row.cityName ? `/${scope.row.cityName}` : '' }}
                {{ scope.row.countyName ? `/ ${scope.row.countyName}` : '' }}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-show="tableListTotal > pageSize"
            class="mt16 pb16"
            layout="prev, pager, next, jumper"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            background
            :total="tableListTotal"
            @current-change="changePage"
            style="padding-right: 10px">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import mixinOpenWindow from '@/utils/mixinOpenWindow';
import { chainApis } from '@/api/industry-map';
import BaseTreeG6 from '@/components/BaseTreeG6/index.vue';
export default {
  name: 'IndustryChain',
  mixins: [mixinOpenWindow],
  components: {
    BaseTreeG6
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
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
      treeLoading: false,
      chainTreeData: {},
      tableData: [],
      tableListTotal: 0,
      currentPage: 1,
      pageSize: 10,
      companyStatusMap: {},
      keyCompanyMap: {},
      companyTypeMap: {},
      filterCompanyType: [],
      filterType: []
    };
  },
  watch: {
    params(val, oldVal) {
      if (val.chainId !== oldVal.chainId || val.regionCode !== oldVal.regionCode) {
        this.chainCode = val.chainCode;
        this.clearData();
        this.getChainDataById();
      }
    }
  },
  created() {
    const allDict = JSON.parse(localStorage.getItem('iep_platform_all_dict'));
    this.handleColor(allDict);
    this.handleCompanyType(allDict.key_company.concat(allDict.company_type));
  },
  methods: {
    handleColor(data) {
      this.companyStatusMap = new Map(data?.company_status?.map((item) => [item.itemCode, item]));
      this.keyCompanyMap = new Map(data?.key_company?.map((item) => [item.itemCode, item]));
      this.companyTypeMap = new Map(data?.company_type?.map((item) => [item.itemCode, item]));
    },
    handleCompanyType(list) {
      this.filterCompanyType = list.map((item) => ({
        backgroundColor: item.backgroundColor,
        color: item.color,
        value: item.itemCode,
        text: item.itemName
      }));
    },
    // 图谱
    getChainDataById() {
      const { chainId, regionCode } = this.params;
      const params = {
        id: chainId,
        regionCode
      };
      this.$emit('loading', 1);
      this.treeLoading = true;
      chainApis
        .getChainById(params)
        .then((result) => {
          this.chainTreeData = {};
          this.chainTreeData.datas = result.data;
          this.getEnterprisesDataByChainId();
          this.$emit('loading', -1);
          this.treeLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.$emit('loading', -1);
          this.treeLoading = false;
        });
    },
    // 图谱点击修改表格
    changeEnterprisesData(node) {
      this.chainCode = node.code;
      this.searchTable();
      this.$emit('changeChainCode', this.chainCode);
    },
    // 分页
    changePage(val) {
      this.currentPage = val;
      this.getEnterprisesDataByChainId();
    },
    searchTable() {
      this.currentPage = 1;
      this.getEnterprisesDataByChainId();
    },
    // 图谱表格
    getEnterprisesDataByChainId() {
      const params = {
        types: this.filterType,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        ...this.params,
        chainCode: this.chainCode,
        chainId: undefined
      };
      this.$emit('loading', 1);
      chainApis
        .getEnterprisesByChainId(params)
        .then((result) => {
          this.tableData = result.data.list.map((n, i) => {
            n.$index = this.$getRowIndex(i, this.currentPage, this.pageSize);
            return n;
          });
          this.tableListTotal = result.data.total;
          this.$emit('loading', -1);
        })
        .catch((err) => {
          this.$emit('loading', -1);
          console.log(err);
        });
    },
    filterHandler(value) {
      this.filterType = value.type;
      // console.log(value.type, this.filterType);
      this.searchTable();
    },
    clearData() {
      this.tableData = [];
      this.tableListTotal = 0;
      this.currentPage = 1;
    }
  }
};
</script>
